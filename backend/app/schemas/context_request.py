from pydantic import BaseModel

class ContextRequest(BaseModel):

    session_id: str

    medicine: str