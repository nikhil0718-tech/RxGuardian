from pydantic import BaseModel

class PrescriptionCreateSchema(BaseModel):

    patient_id: int

    medicine_name: str

    dosage: str

    frequency: str

    duration: str

    timing: str

    scheduled_time: str