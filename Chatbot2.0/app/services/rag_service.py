"""RAG service: Pinecone hosted embeddings (multilingual-e5-large) + Pinecone vector store.

Embeddings are computed by Pinecone's inference API so we can reuse the existing
1024-d `evchamp` index. Gemini is used only for chat in llm_service.

Public surface:
    - RAGService.is_ready()
    - RAGService.embed(text) -> list[float]
    - RAGService.embed_batch(texts) -> list[list[float]]
    - RAGService.query(question, top_k) -> list[dict]   # {text, source, title, score}
    - RAGService.upsert(documents)                      # docs: list of {id, text, metadata}
    - RAGService.ensure_index()
"""
from __future__ import annotations

import logging
from typing import List, Dict, Any, Optional

from pinecone import Pinecone, ServerlessSpec

from app.core.config import settings

logger = logging.getLogger(__name__)

# Pinecone enforces tight metadata size — keep text chunks reasonable.
MAX_METADATA_TEXT_CHARS = 35_000


class RAGService:
    def __init__(self) -> None:
        self._pc: Optional[Pinecone] = None
        self._index = None
        self._error: Optional[str] = None
        self._init()

    # ----------------------------------------------------------- init

    def _init(self) -> None:
        if not settings.PINECONE_API_KEY:
            self._error = "PINECONE_API_KEY not configured"
            logger.warning(self._error)
            return
        try:
            self._pc = Pinecone(api_key=settings.PINECONE_API_KEY)
            existing = {i["name"] for i in self._pc.list_indexes()}
            if settings.PINECONE_INDEX_NAME in existing:
                self._index = self._pc.Index(settings.PINECONE_INDEX_NAME)
                logger.info("Connected to Pinecone index '%s'", settings.PINECONE_INDEX_NAME)
            else:
                logger.warning(
                    "Pinecone index '%s' does not exist. Run the ingest script with --reset.",
                    settings.PINECONE_INDEX_NAME,
                )
        except Exception as e:
            self._error = f"RAG init failed: {e}"
            logger.exception("RAG init failed")

    def is_ready(self) -> bool:
        return self._index is not None and not self._error

    # ----------------------------------------------------------- index

    def ensure_index(self) -> None:
        if not self._pc:
            raise RuntimeError(self._error or "Pinecone client not initialized")
        existing = {i["name"] for i in self._pc.list_indexes()}
        if settings.PINECONE_INDEX_NAME not in existing:
            logger.info(
                "Creating Pinecone index '%s' (dim=%d, %s, %s)",
                settings.PINECONE_INDEX_NAME,
                settings.PINECONE_EMBEDDING_DIM,
                settings.PINECONE_CLOUD,
                settings.PINECONE_REGION,
            )
            self._pc.create_index(
                name=settings.PINECONE_INDEX_NAME,
                dimension=settings.PINECONE_EMBEDDING_DIM,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud=settings.PINECONE_CLOUD,
                    region=settings.PINECONE_REGION,
                ),
            )
        self._index = self._pc.Index(settings.PINECONE_INDEX_NAME)

    # ----------------------------------------------------------- embeddings (Pinecone inference)

    def _embed(self, texts: List[str], input_type: str) -> List[List[float]]:
        """Call Pinecone's inference API to embed texts.

        input_type: "passage" for documents being indexed, "query" for user queries.
        """
        if not self._pc:
            raise RuntimeError(self._error or "Pinecone client not initialized")
        if not texts:
            return []
        result = self._pc.inference.embed(
            model=settings.PINECONE_EMBEDDING_MODEL,
            inputs=texts,
            parameters={"input_type": input_type, "truncate": "END"},
        )
        # result is EmbeddingsList; each item has .values
        return [list(item["values"]) for item in result.data]

    def embed(self, text: str, input_type: str = "query") -> List[float]:
        out = self._embed([text], input_type=input_type)
        return out[0] if out else []

    def embed_batch(self, texts: List[str], input_type: str = "passage") -> List[List[float]]:
        # Pinecone inference batch limit varies by model; chunk to be safe
        results: List[List[float]] = []
        BATCH = 96
        for i in range(0, len(texts), BATCH):
            results.extend(self._embed(texts[i : i + BATCH], input_type=input_type))
        return results

    # ----------------------------------------------------------- query

    def query(self, question: str, top_k: Optional[int] = None) -> List[Dict[str, Any]]:
        if not self.is_ready():
            logger.warning("RAG query called but service is not ready: %s", self._error)
            return []
        top_k = top_k or settings.RAG_TOP_K
        try:
            vector = self.embed(question, input_type="query")
            if not vector:
                return []
            res = self._index.query(
                vector=vector,
                top_k=top_k,
                include_metadata=True,
                namespace=settings.PINECONE_NAMESPACE,
            )
            matches = []
            for m in res.get("matches", []) or []:
                meta = m.get("metadata") or {}
                matches.append(
                    {
                        "id": m.get("id"),
                        "score": m.get("score"),
                        "text": meta.get("text", ""),
                        "source": meta.get("source", ""),
                        "title": meta.get("title", ""),
                    }
                )
            return matches
        except Exception:
            logger.exception("Pinecone query failed")
            return []

    # ----------------------------------------------------------- upsert

    def upsert(self, documents: List[Dict[str, Any]], batch_size: int = 64) -> int:
        if not self._index:
            self.ensure_index()
        if not documents:
            return 0
        upserted = 0
        for start in range(0, len(documents), batch_size):
            batch = documents[start : start + batch_size]
            texts = [d["text"] for d in batch]
            vectors = self.embed_batch(texts, input_type="passage")
            items = []
            for doc, vec in zip(batch, vectors):
                meta = dict(doc.get("metadata") or {})
                meta["text"] = doc["text"][:MAX_METADATA_TEXT_CHARS]
                items.append({"id": doc["id"], "values": vec, "metadata": meta})
            self._index.upsert(vectors=items, namespace=settings.PINECONE_NAMESPACE)
            upserted += len(items)
            logger.info("Upserted %d / %d", upserted, len(documents))
        return upserted

    def stats(self) -> Dict[str, Any]:
        if not self._index:
            return {"ready": False, "error": self._error}
        try:
            return {"ready": True, **self._index.describe_index_stats()}
        except Exception as e:
            return {"ready": False, "error": str(e)}


_rag_service: Optional[RAGService] = None


def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
