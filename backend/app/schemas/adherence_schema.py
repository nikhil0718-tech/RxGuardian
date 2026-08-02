from pydantic import BaseModel


class AdherenceUpdateSchema(BaseModel):

    reminder_id: int

    medicine_name: str

    status: str