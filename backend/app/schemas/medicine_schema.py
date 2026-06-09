from pydantic import BaseModel


class MedicineResponse(
    BaseModel
):

    success: bool

    medicine: str | None = None

    confidence: float | None = None

    summary: str | None = None

    message: str | None = None