from sqlalchemy.orm import Session

from app.models.reminder_model import (
    Reminder
)

def execute(
    db: Session,
    patient_id: int
):

    reminders = (

        db.query(
            Reminder
        )

        .filter(

            Reminder.patient_id
            == patient_id

        )

        .all()
    )

    result = []

    for reminder in reminders:

        result.append({

            "medicine_name":
            reminder.medicine_name,

            "scheduled_time":
            reminder.scheduled_time,

            "status":
            reminder.status,

            "verified":
            reminder.medicine_verified

        })

    return result