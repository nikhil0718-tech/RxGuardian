from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.reminder_model import (
    Reminder
)

from app.models.user_model import User

router = APIRouter(

    prefix="/adherence",

    tags=["Adherence"]
)

# =====================================================
# GET PATIENT ADHERENCE SUMMARY
# =====================================================

@router.get("/patient/{patient_id}")

def get_patient_adherence(

    patient_id: int,

    db: Session = Depends(get_db)
):

    # =========================================
    # FETCH REMINDERS
    # =========================================

    reminders = db.query(
        Reminder
    ).filter(

        Reminder.patient_id == patient_id

    ).all()

    # =========================================
    # COUNTS
    # =========================================

    total_medicines = len(
        reminders
    )

    taken_medicines = len([

        reminder

        for reminder in reminders

        if reminder.status == "taken"
    ])

    missed_medicines = len([

        reminder

        for reminder in reminders

        if reminder.status == "missed"
    ])

    pending_medicines = len([

        reminder

        for reminder in reminders

        if reminder.status == "pending"
    ])

    # =========================================
    # ADHERENCE %
    # =========================================

    adherence_percentage = 0

    if total_medicines > 0:

        adherence_percentage = round(

            (
                taken_medicines
                /
                total_medicines
            ) * 100,

            2
        )

    # =====================================
    # RISK LEVEL
    # =====================================

    if total_medicines == 0 or (taken_medicines == 0 and missed_medicines == 0):

        risk_level = "MONITORING"

    elif adherence_percentage >= 80:

        risk_level = "LOW"

    elif adherence_percentage >= 50:

        risk_level = "MEDIUM"

    else:

        risk_level = "HIGH"

    # =========================================
    # HISTORY DATA
    # =========================================

    history = []

    for reminder in reminders:

        history.append({

        "medicine_name":
        reminder.medicine_name,

        "scheduled_time":
        reminder.scheduled_time,

        "status":
        reminder.status,

        "date":

        reminder.created_at.strftime(
            "%d-%m-%Y"
        )

        if reminder.created_at

        else

        "N/A"
    })

    # =========================================
    # RETURN
    # =========================================

    return {

        "total_medicines":
        total_medicines,

        "taken_medicines":
        taken_medicines,

        "missed_medicines":
        missed_medicines,

        "pending_medicines":
        pending_medicines,

        "adherence_percentage":
        adherence_percentage,

        "risk_level":
        risk_level,

        "history":
        history
    }


# =====================================================
# ADHERENCE BY EMAIL
# =====================================================

@router.get("/patient-email/{email}")

def get_adherence_by_email(

    email: str,

    db: Session = Depends(get_db)
):

    patient = db.query(

        User

    ).filter(

        User.email == email

    ).first()

    if not patient:

        return {

            "history": []
        }

    return get_patient_adherence(

        patient.id,

        db
    )