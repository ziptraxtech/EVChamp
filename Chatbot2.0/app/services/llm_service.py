"""LLM service backed by Google Gemini (google-genai SDK).
RAG context comes from Pinecone via RAGService.
"""
from __future__ import annotations

import logging
from typing import List, Dict, Any, Optional

from google import genai
from google.genai import types as genai_types

from app.core.config import settings
from app.services.rag_service import get_rag_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are EVChamp Assistant, the official AI helper for the EVChamp platform "
    "(evchamp.in) and its products including Zeflash, ZipBattery, and Investyz. "
    "Answer user questions about EVChamp's services — plans, charging network, "
    "battery diagnostics, EV marketplace, franchise opportunities, INVESTYZ, "
    "ZipBattery, Zeflash, RSA plans, and related topics. "
    "When relevant context is provided, ground your answer in it and cite the "
    "source URL inline. If you don't know, say so honestly and suggest contacting "
    "EVChamp support. Be concise, friendly, and professional."
)


class LLMService:
    def __init__(self) -> None:
        self._client: Optional[genai.Client] = None
        self._error: Optional[str] = None
        self._init()

    def _init(self) -> None:
        if not settings.GEMINI_API_KEY:
            self._error = "GEMINI_API_KEY not configured"
            logger.warning(self._error)
            return
        try:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
            logger.info(
                "Gemini LLM initialized (chat=%s, rag=%s)",
                settings.GEMINI_CHAT_MODEL,
                settings.GEMINI_RAG_MODEL,
            )
        except Exception as e:
            self._error = f"Gemini init failed: {e}"
            logger.exception("Gemini init failed")

    # -------------------------------------------------------- history

    def _to_gemini_history(self, messages: List[Any]) -> List[genai_types.Content]:
        """Convert DB messages -> google-genai Content list."""
        history: List[genai_types.Content] = []
        for msg in messages[-10:]:
            content = getattr(msg, "content", "") or ""
            if not content:
                continue
            role = "user" if getattr(msg, "is_user", False) else "model"
            history.append(
                genai_types.Content(role=role, parts=[genai_types.Part(text=content)])
            )
        return history

    # -------------------------------------------------------- RAG

    def _build_rag_prompt(self, query: str) -> str:
        rag = get_rag_service()
        matches = rag.query(query)
        if not matches:
            return query

        context_blocks = []
        for i, m in enumerate(matches, start=1):
            src = m.get("source") or m.get("title") or "EVChamp content"
            context_blocks.append(f"[{i}] Source: {src}\n{m.get('text', '')}")
        context = "\n\n---\n\n".join(context_blocks)

        return (
            "Use the following EVChamp knowledge base excerpts to answer the user's "
            "question. Prefer information from these excerpts over your general "
            "knowledge. Cite the relevant source URL when you use a fact.\n\n"
            f"CONTEXT:\n{context}\n\n"
            f"QUESTION: {query}"
        )

    # -------------------------------------------------------- generation

    async def generate_response(
        self,
        query: str,
        chat_history: List[Any],
        rag_enabled: bool = False,
    ) -> str:
        if self._error or not self._client:
            return self._fallback(query, self._error or "LLM not initialized")

        try:
            prompt = self._build_rag_prompt(query) if rag_enabled else query
            model_name = settings.GEMINI_RAG_MODEL if rag_enabled else settings.GEMINI_CHAT_MODEL
            # Drop the most recent user message — we send it as the new turn.
            prior = chat_history[:-1] if chat_history else []

            chat = self._client.chats.create(
                model=model_name,
                config=genai_types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.7,
                    max_output_tokens=1024,
                ),
                history=self._to_gemini_history(prior),
            )
            response = chat.send_message(prompt)
            text = (response.text or "").strip()
            if not text:
                return self._fallback(query, "Empty response from Gemini")
            return text
        except Exception as e:
            logger.exception("Gemini generation failed")
            err = str(e).lower()
            if "api key" in err or "permission" in err or "401" in err:
                return "There seems to be an issue with the Gemini API configuration. Please contact support."
            if "rate" in err and "limit" in err:
                return "I'm currently experiencing high demand. Please try again in a moment."
            if "quota" in err:
                return "The Gemini API quota has been exceeded. Please try again later."
            return self._fallback(query, str(e))

    # -------------------------------------------------------- fallback

    def _fallback(self, query: str, error_msg: str) -> str:
        logger.warning("Falling back: %s", error_msg)
        return (
            "I'm sorry — I can't reach my AI engine right now. "
            "Please try again in a moment, or contact EVChamp support at evchamp.in/contact. "
            f"(Your question: '{query[:80]}')"
        )

    # -------------------------------------------------------- diagnostics

    def is_healthy(self) -> bool:
        return self._client is not None and not self._error

    def get_status(self) -> Dict[str, Any]:
        return {
            "provider": "google-gemini",
            "healthy": self.is_healthy(),
            "chat_model": settings.GEMINI_CHAT_MODEL,
            "rag_model": settings.GEMINI_RAG_MODEL,
            "embedding_model": settings.PINECONE_EMBEDDING_MODEL,
            "rag_ready": get_rag_service().is_ready(),
            "error": self._error,
        }
