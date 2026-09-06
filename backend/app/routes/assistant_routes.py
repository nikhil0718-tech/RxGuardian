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
from fastapi import Depends

from app.middleware.jwt_middleware import (
    verify_token
)

from app.config.database import (
    SessionLocal
)

from app.services.assistant_service_v2 import (
    AssistantServiceV2
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

@router.post("/chat-v2")
def chat_v2(
    request: AssistantRequest,
    user=Depends(verify_token)
):
    print("CHAT V2 HIT")

    db = SessionLocal()

    try:

        user_id = user["id"]

        answer = (

            AssistantServiceV2
            .ask_ai(

                request.session_id,

                request.message,

                user_id,

                db

            )
        )

        return {

            "answer":
            answer
        }

    finally:

        db.close()