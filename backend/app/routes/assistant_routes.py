from fastapi import APIRouter

from app.services.assistant_service import (
    AssistantService
)
from app.schemas.assistant_schema import (
    AssistantRequest
)


from app.services.conversation_memory import (
    save_medicine
)

router = APIRouter(

    prefix="/assistant",

    tags=["Assistant"]
)

@router.post("/chat")
def chat(
    request: AssistantRequest
):

    session_id = (
        request.session_id
    )

    message = (
        request.message
    )

    answer = (

        AssistantService
        .ask_ai(

            request.session_id,

            request.message

        )
    )

    return {

        "answer":
        answer
    }

@router.post("/set-context")
def set_context(data: dict):

    session_id = data.get("session_id")

    medicine = data.get("medicine")

    print("SESSION:", session_id)
    print("MEDICINE:", medicine)

    save_medicine(
        session_id,
        medicine
    )

    return {
        "success": True
    }