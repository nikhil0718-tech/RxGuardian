from pydantic import BaseModel


class ReminderCreateSchema(BaseModel):

    prescription_id: int

    patient_id: int

    medicine_name: str

    scheduled_time: str