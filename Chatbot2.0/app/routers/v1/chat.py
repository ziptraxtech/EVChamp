"""Stateless chat router.

The frontend keeps conversation history in sessionStorage and sends it with
every request. The backend just answers — it never touches a database.

Endpoints:
  POST /api/v1/chat/message    -> generate a bot reply from {content, history, rag_enabled}
  GET  /api/v1/chat/health/llm -> diagnostics
"""
from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatMessageRequest, ChatMessageResponse
from app.services.llm_service import LLMService

router = APIRouter()

_llm_service: LLMService | None = None


def get_llm_service() -> LLMService:
    global _llm_service
    if _llm_service is None:
        try:
            _llm_service = LLMService()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"LLM init failed: {e}")
    return _llm_service


@router.post("/message", response_model=ChatMessageResponse)
async def send_message(req: ChatMessageRequest):
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="content cannot be empty")

    # Build a history list that includes the new turn so the LLM sees it last.
    history = list(req.history) + [type(req.history[0] if req.history else None) if False else None]
    # Simpler: just pass history as-is; LLM service drops the last user msg before sending.
    # We'll append the current user turn so generate_response can see it consistently.
    from app.schemas.chat import HistoryMessage
    full_history = list(req.history) + [HistoryMessage(is_user=True, content=req.content)]

    try:
        llm = get_llm_service()
        reply = await llm.generate_response(
            query=req.content,
            chat_history=full_history,
            rag_enabled=req.rag_enabled,
        )
    except Exception as e:
        reply = (
            "I'm sorry — I'm having trouble responding right now. "
            f"Please try again in a moment. (error: {str(e)[:80]})"
        )

    return ChatMessageResponse(reply=reply)


@router.get("/health/llm")
async def check_llm_health():
    try:
        llm = get_llm_service()
        return {"status": "healthy" if llm.is_healthy() else "unhealthy", **llm.get_status()}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
