from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.chat_service import ChatService


router = APIRouter()

chat_service = ChatService()


class ChatRequest(BaseModel):

    question: str


@router.post("/chat")
async def chat(
    request: ChatRequest
):

    result = chat_service.ask(
        request.question
    )

    return result