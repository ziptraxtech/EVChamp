"""Stateless chat schemas — history is provided by the client per request."""
from typing import List
from pydantic import BaseModel


class HistoryMessage(BaseModel):
    """One turn of conversation as provided by the client."""
    is_user: bool
    content: str


class ChatMessageRequest(BaseModel):
    content: str
    history: List[HistoryMessage] = []
    rag_enabled: bool = True


class ChatMessageResponse(BaseModel):
    reply: str
