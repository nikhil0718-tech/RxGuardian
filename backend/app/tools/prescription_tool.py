from sqlalchemy.orm import Session

from app.models.prescription_model import (
    Prescription
)
from datetime import date


def execute(
    db: Session,
    patient_id: int
):

    today = date.today()

    prescriptions = (

        db.query(
            Prescription
        )

        .filter(
            Prescription.patient_id
            == patient_id
        )

        .filter(
            Prescription.start_date
            <= today
        )

        .filter(
            Prescription.end_date
            >= today
        )

        .all()
    )

    if not prescriptions:

        return []

    results = []

    for prescription in prescriptions:

        results.append({

            "medicine_name":
            prescription.medicine_name,

            "dosage":
            prescription.dosage,

            "frequency":
            prescription.frequency,

            "duration":
            prescription.duration,

            "timing":
            prescription.timing,

            "scheduled_time":
            prescription.scheduled_time

        })

    return results