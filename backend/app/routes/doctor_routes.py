from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.user_model import (
    User
)

from app.models.reminder_model import (
    Reminder
)

router = APIRouter(

    prefix="/doctor",

    tags=["Doctor"]
)

# =====================================================
# GET ALL PATIENTS
# =====================================================

@router.get("/patients")

def get_all_patients(

    db: Session = Depends(get_db)
):

    # =====================================
    # FETCH PATIENTS
    # =====================================

    patients = db.query(
        User
    ).filter(

        User.role == "patient"
    ).all()

    result = []

    # =====================================
    # LOOP PATIENTS
    # =====================================

    for patient in patients:

        reminders = db.query(
            Reminder
        ).filter(

            Reminder.patient_id
            == patient.id

        ).all()

        total = len(reminders)

        taken = len([

            reminder

            for reminder in reminders

            if reminder.status == "taken"
        ])

        missed = len([

            reminder

            for reminder in reminders

            if reminder.status == "missed"
        ])

        adherence = 0

        if total > 0:

            adherence = round(

                (
                    taken
                    /
                    total
                ) * 100,

                2
            )

        # =================================
        # RISK
        # =================================

        risk = "LOW"

        if adherence < 80:

            risk = "MEDIUM"

        if adherence < 50:

            risk = "HIGH"

        # =================================
        # RESPONSE
        # =================================

        result.append({

            "patient_id":
            patient.id,

            "patient_name":
            patient.name,

            "email":
            patient.email,

            "adherence_percentage":
            adherence,

            "missed_medicines":
            missed,

            "risk_level":
            risk
        })

    return result
# =====================================================
# DOCTOR ANALYTICS
# =====================================================

@router.get("/analytics")

def doctor_analytics(

    db: Session = Depends(get_db)
):

    # =====================================
    # FETCH PATIENTS
    # =====================================

    patients = db.query(
        User
    ).filter(

        User.role == "patient"
    ).all()

    total_patients = len(
        patients
    )

    total_adherence = 0

    high_risk_patients = 0

    total_missed_medicines = 0

    # =====================================
    # LOOP PATIENTS
    # =====================================

    for patient in patients:

        reminders = db.query(
            Reminder
        ).filter(

            Reminder.patient_id
            == patient.id

        ).all()

        total = len(reminders)

        taken = len([

            reminder

            for reminder in reminders

            if reminder.status == "taken"
        ])

        missed = len([

            reminder

            for reminder in reminders

            if reminder.status == "missed"
        ])

        total_missed_medicines += missed

        adherence = 0

        if total > 0:

            adherence = (

                taken
                /
                total
            ) * 100

        total_adherence += adherence

        # =================================
        # HIGH RISK
        # =================================

        if adherence < 50:

            high_risk_patients += 1

    # =====================================
    # AVERAGE ADHERENCE
    # =====================================

    average_adherence = 0

    if total_patients > 0:

        average_adherence = round(

            total_adherence
            /
            total_patients,

            2
        )

    # =====================================
    # RETURN
    # =====================================

    return {

        "total_patients":
        total_patients,

        "average_adherence":
        average_adherence,

        "high_risk_patients":
        high_risk_patients,

        "total_missed_medicines":
        total_missed_medicines
    }