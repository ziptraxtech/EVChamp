"""Ingest EVChamp web content into Pinecone.

Usage:
    cd ev-champ-chatbot
    python -m scripts.ingest                 # ingest URLs from config + local README
    python -m scripts.ingest --reset         # delete the index and re-create before ingest
    python -m scripts.ingest --url <url>     # also include extra URL(s)
"""
from __future__ import annotations

import argparse
import hashlib
import logging
import re
import sys
from pathlib import Path
from typing import Iterable, List, Dict, Any

import httpx
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

# Make `app` importable when run as `python -m scripts.ingest` from ev-champ-chatbot/
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from app.core.config import settings  # noqa: E402
from app.services.rag_service import RAGService  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("ingest")

REPO_ROOT = PROJECT_ROOT.parent  # the EVChamp-main folder

CHUNK_SIZE = 1200       # characters per chunk
CHUNK_OVERLAP = 150     # characters of overlap

USER_AGENT = "EVChampRAGBot/1.0 (+https://evchamp.in)"


# ---------------------------------------------------------------- fetching


def fetch_html(url: str) -> str:
    try:
        with httpx.Client(timeout=20.0, follow_redirects=True, headers={"User-Agent": USER_AGENT}) as c:
            r = c.get(url)
            r.raise_for_status()
            return r.text
    except Exception as e:
        logger.warning("Failed to fetch %s: %s", url, e)
        return ""


def fetch_rendered_html(page, url: str) -> str:
    """Fetch a page using a headless browser so client-rendered SPAs return real content."""
    try:
        page.goto(url, wait_until="networkidle", timeout=30_000)
    except PWTimeout:
        logger.warning("Playwright networkidle timeout for %s — using current DOM", url)
    except Exception as e:
        logger.warning("Playwright nav error for %s: %s", url, e)
        return ""
    try:
        # Best-effort: wait briefly for any late-loading content
        page.wait_for_timeout(800)
        return page.content()
    except Exception as e:
        logger.warning("Playwright failed to read content for %s: %s", url, e)
        return ""


def html_to_text(html: str) -> tuple[str, str]:
    """Return (title, clean_text)."""
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "noscript", "svg", "iframe"]):
        tag.decompose()
    title = (soup.title.string.strip() if soup.title and soup.title.string else "")
    text = soup.get_text(separator="\n")
    text = re.sub(r"\n{2,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return title, text.strip()


# ---------------------------------------------------------------- TSX fallback


JSX_TEXT_REGEX = re.compile(r">([^<>{}\n]{6,})<", re.DOTALL)


def extract_text_from_tsx(path: Path) -> str:
    """Crude extractor: pull text between JSX tags. Used as a fallback when the
    live URL is a SPA shell with no rendered content."""
    try:
        src = path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""
    pieces = []
    for m in JSX_TEXT_REGEX.finditer(src):
        chunk = m.group(1).strip()
        # Drop fragments that look like code/JSX, not English
        if any(sym in chunk for sym in ["${", "=>", "import ", "useState", "className"]):
            continue
        if len(chunk.split()) < 3:
            continue
        pieces.append(chunk)
    return "\n".join(pieces)


# ---------------------------------------------------------------- chunking


def chunk_text(text: str, source: str, title: str) -> List[Dict[str, Any]]:
    """Split text into overlapping chunks. Returns list of dicts ready for upsert."""
    if not text:
        return []
    out = []
    start = 0
    n = len(text)
    idx = 0
    while start < n:
        end = min(start + CHUNK_SIZE, n)
        chunk = text[start:end].strip()
        if len(chunk) > 80:  # skip tiny chunks
            doc_id = hashlib.md5(f"{source}:{idx}:{chunk[:120]}".encode()).hexdigest()
            out.append(
                {
                    "id": doc_id,
                    "text": chunk,
                    "metadata": {
                        "source": source,
                        "title": title,
                        "chunk_index": idx,
                    },
                }
            )
            idx += 1
        if end >= n:
            break
        start = end - CHUNK_OVERLAP
    return out


# ---------------------------------------------------------------- builders


def build_docs_from_urls(urls: Iterable[str], use_playwright: bool = True) -> List[Dict[str, Any]]:
    docs: List[Dict[str, Any]] = []
    urls = list(urls)
    if not urls:
        return docs

    # First pass: cheap httpx fetch. Anything thin gets a Playwright retry.
    spa_urls: List[str] = []
    for url in urls:
        logger.info("Fetching (httpx) %s", url)
        html = fetch_html(url)
        if not html:
            spa_urls.append(url)
            continue
        title, text = html_to_text(html)
        if len(text) < 400:
            logger.info("  -> only %d chars, queueing for browser render", len(text))
            spa_urls.append(url)
            continue
        chunks = chunk_text(text, source=url, title=title or url)
        logger.info("  -> %d chunks (%d chars)", len(chunks), len(text))
        docs.extend(chunks)

    # Second pass: headless browser for SPAs
    if spa_urls and use_playwright:
        logger.info("Rendering %d SPA pages with Playwright...", len(spa_urls))
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(user_agent=USER_AGENT)
            page = context.new_page()
            for url in spa_urls:
                logger.info("Rendering %s", url)
                html = fetch_rendered_html(page, url)
                if not html:
                    continue
                title, text = html_to_text(html)
                if len(text) < 200:
                    logger.warning("  -> still only %d chars after render, skipping", len(text))
                    continue
                chunks = chunk_text(text, source=url, title=title or url)
                logger.info("  -> %d chunks (%d chars)", len(chunks), len(text))
                docs.extend(chunks)
            browser.close()
    return docs


def build_docs_from_local_repo() -> List[Dict[str, Any]]:
    """Always-available fallback: ingest README and meaningful TSX content from the repo."""
    docs: List[Dict[str, Any]] = []

    # README
    readme = REPO_ROOT / "README.md"
    if readme.exists():
        text = readme.read_text(encoding="utf-8", errors="ignore")
        chunks = chunk_text(text, source="repo://README.md", title="EVChamp README")
        logger.info("README.md -> %d chunks", len(chunks))
        docs.extend(chunks)

    # Top-level pages that map to routes on evchamp.in
    components_dir = REPO_ROOT / "src" / "components"
    target_components = [
        ("AboutUs.tsx", "https://evchamp.in/about", "About EVChamp"),
        ("Investyz.tsx", "https://evchamp.in/investyz", "INVESTYZ"),
        ("ZipBattery.tsx", "https://evchamp.in/zipbattery", "ZipBattery"),
        ("Zeflash.tsx", "https://evchamp.in/zeflash", "Zeflash"),
        ("ZeVaultPage.tsx", "https://evchamp.in/zevault", "ZeVault"),
        ("ChargingNetwork.tsx", "https://evchamp.in/charging-network", "Charging Network"),
        ("BuyPlans.tsx", "https://evchamp.in/buy-plans", "Buy Plans"),
        ("BuyUsedEV.tsx", "https://evchamp.in/buy-used-ev", "Buy Used EV"),
        ("SellEV.tsx", "https://evchamp.in/sell-ev", "Sell EV"),
        ("Franchise.tsx", "https://evchamp.in/franchise", "Franchise"),
        ("SmarterEVAssistance.tsx", "https://evchamp.in/ev-assistance", "EV Assistance"),
        ("RSAPlans.tsx", "https://evchamp.in/rsa-plans", "RSA Plans"),
        ("ServiceCentres.tsx", "https://evchamp.in/service-centres", "Service Centres"),
        ("ContactUs.tsx", "https://evchamp.in/contact", "Contact Us"),
        ("ServicesShowcase.tsx", "https://evchamp.in", "EVChamp Home"),
    ]
    for fname, url, title in target_components:
        p = components_dir / fname
        if not p.exists():
            continue
        text = extract_text_from_tsx(p)
        if len(text) < 100:
            continue
        chunks = chunk_text(text, source=url, title=title)
        logger.info("%s -> %d chunks", fname, len(chunks))
        docs.extend(chunks)
    return docs


# ---------------------------------------------------------------- main


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Delete & re-create the Pinecone index")
    parser.add_argument("--url", action="append", default=[], help="Extra URL(s) to ingest")
    parser.add_argument("--no-urls", action="store_true", help="Skip live URL fetching (use local repo only)")
    parser.add_argument("--no-local", action="store_true", help="Skip local repo content")
    args = parser.parse_args()

    if not settings.GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY is missing. Set it in your .env or environment.")
        return 1
    if not settings.PINECONE_API_KEY:
        logger.error("PINECONE_API_KEY is missing. Set it in your .env or environment.")
        return 1

    rag = RAGService()
    if rag._error and "does not exist" not in rag._error:
        logger.error("RAG service failed to initialize: %s", rag._error)
        return 1

    if args.reset and rag._pc:
        existing = {i["name"] for i in rag._pc.list_indexes()}
        if settings.PINECONE_INDEX_NAME in existing:
            logger.info("Deleting existing index '%s'", settings.PINECONE_INDEX_NAME)
            rag._pc.delete_index(settings.PINECONE_INDEX_NAME)

    rag.ensure_index()

    urls = list(settings.INGEST_URLS) + list(args.url or [])
    docs: List[Dict[str, Any]] = []
    if not args.no_urls:
        docs.extend(build_docs_from_urls(urls))
    if not args.no_local:
        docs.extend(build_docs_from_local_repo())

    # De-duplicate by id
    seen, unique_docs = set(), []
    for d in docs:
        if d["id"] in seen:
            continue
        seen.add(d["id"])
        unique_docs.append(d)

    logger.info("Prepared %d unique chunks to upsert", len(unique_docs))
    if not unique_docs:
        logger.error("No content to ingest. Check URL reachability or local repo path.")
        return 1

    count = rag.upsert(unique_docs)
    logger.info("Done. Upserted %d vectors into Pinecone index '%s'.", count, settings.PINECONE_INDEX_NAME)
    logger.info("Stats: %s", rag.stats())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
