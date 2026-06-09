from fastapi import APIRouter
from pydantic import BaseModel

from app.services.medicine_chat_service import (
    MedicineChatService
)

router = APIRouter(
    prefix="/medicine-chat",
    tags=["Medicine Chat"]
)


class ChatRequest(BaseModel):
    medicine_name: str
    question: str


@router.post("/ask")
def ask_question(
    request: ChatRequest
):

    return MedicineChatService.ask(
        request.medicine_name,
        request.question
    )