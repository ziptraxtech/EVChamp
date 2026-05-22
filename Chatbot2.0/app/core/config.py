import os
from typing import List, Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings.

    Only secrets come from .env (GEMINI_API_KEY, PINECONE_API_KEY).
    All other configuration is hardcoded here.
    """

    # ---------- API ----------
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "EV Champ API"
    PROJECT_DESCRIPTION: str = "API for EV Champ Chatbot"
    PROJECT_VERSION: str = "0.1.0"

    # ---------- CORS ----------
    CORS_ORIGINS: List[str] = ["*"]

    # ---------- Gemini (chat LLM) ----------
    # Secret — required, must come from .env
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    # Non-secret defaults
    GEMINI_CHAT_MODEL: str = "gemini-2.5-flash"
    GEMINI_RAG_MODEL: str = "gemini-2.5-flash"

    # ---------- Pinecone (Vector DB + Hosted Embeddings) ----------
    # Secret — required, must come from .env
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "")
    # Non-secret defaults
    PINECONE_INDEX_NAME: str = "evchamp"
    PINECONE_CLOUD: str = "aws"
    PINECONE_REGION: str = "us-east-1"
    PINECONE_NAMESPACE: str = "default"
    PINECONE_EMBEDDING_MODEL: str = "multilingual-e5-large"
    PINECONE_EMBEDDING_DIM: int = 1024
    RAG_TOP_K: int = 5

    # ---------- Sources for ingestion ----------
    INGEST_URLS: List[str] = [
        "https://www.evchamp.in",
        "https://evchamp.in/about",
        "https://evchamp.in/investyz",
        "https://evchamp.in/zipbattery",
        "https://evchamp.in/zeflash",
        "https://evchamp.in/charging-network",
        "https://evchamp.in/buy-plans",
        "https://evchamp.in/buy-used-ev",
        "https://evchamp.in/sell-ev",
        "https://evchamp.in/franchise",
        "https://evchamp.in/ev-assistance",
        "https://evchamp.in/rsa-plans",
        "https://evchamp.in/service-centres",
        "https://evchamp.in/contact",
        "https://www.zeflash.app",
        "https://insights.zipsureai.com/",
    ]

    # ---------- Security ----------
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # Legacy / optional fields kept so old .env files don't break
    GROQ_API_KEY: Optional[str] = None
    LLM_PROVIDER: Optional[str] = None
    LLM_MODEL_NAME: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    AWS_REGION: Optional[str] = None
    RAG_MODEL_NAME: Optional[str] = None
    CHAT_MODEL_NAME: Optional[str] = None

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "ignore",
    }


settings = Settings()
