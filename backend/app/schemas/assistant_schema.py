from pydantic import BaseModel

class AssistantRequest(
    BaseModel
):

    session_id: str

    message: str