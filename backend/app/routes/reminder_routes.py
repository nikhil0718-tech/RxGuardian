from fastapi import APIRouter
from fastapi import Depends
from fastapi import UploadFile
from fastapi import File

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.reminder_model import (
    Reminder
)

from app.models.user_model import (
    User
)

from app.utils.status_engine import (
    update_missed_medicines
)

from app.utils.ai_helper import (
    verify_tablet_logic
)

from app.utils.guardian_alert_engine import (
    update_guardian_alerts
)
from app.models.guardian_alert_model import (
    GuardianAlert
)
import os

router = APIRouter(

    prefix="/reminders",

    tags=["Reminders"]
)

# =====================================================
# GET PATIENT REMINDERS
# =====================================================

@router.get("/patient/{patient_id}")

def get_patient_reminders(

    patient_id: int,

    db: Session = Depends(get_db)
):

    try:

        update_missed_medicines(db)

        reminders = db.query(
            Reminder
        ).filter(

            Reminder.patient_id
            == patient_id

        ).order_by(

            Reminder.id.desc()

        ).all()

        print(
            f"PATIENT {patient_id} REMINDERS =",
            len(reminders)
        )

        result = []

        for reminder in reminders:

            result.append({

                "id":
                reminder.id,

                "medicine_name":
                reminder.medicine_name,

                "scheduled_time":
                reminder.scheduled_time,

                "status":
                reminder.status,

                "notification_count":
                reminder.notification_count,

                "guardian_notified":
                reminder.guardian_notified
            })

        return result

    except Exception as e:

        print(
            "GET REMINDERS ERROR:",
            e
        )

        return []

# =====================================================
# GET PATIENT REMINDERS BY EMAIL
# =====================================================

@router.get("/patient-email/{email}")

def get_patient_reminders_by_email(

    email: str,

    db: Session = Depends(get_db)
):

    patient = db.query(

        User

    ).filter(

        User.email == email

    ).first()

    if not patient:

        return []

    reminders = db.query(

        Reminder

    ).filter(

        Reminder.patient_id
        == patient.id

    ).all()

    return reminders

# =====================================================
# VERIFY AND TAKE MEDICINE
# =====================================================

@router.post("/verify-and-take/{reminder_id}")

async def verify_and_take(

    reminder_id: int,

    file: UploadFile = File(...),

    db: Session = Depends(get_db)
):

    image_path = None

    try:

        # =================================
        # FETCH REMINDER
        # =================================

        reminder = db.query(
            Reminder
        ).filter(

            Reminder.id == reminder_id

        ).first()

        if not reminder:

            return {

                "verified": False,

                "status":
                "failed",

                "message":
                "Reminder not found"
            }

        # =================================
        # CREATE UPLOADS FOLDER
        # =================================

        os.makedirs(

            "uploads",

            exist_ok=True
        )

        # =================================
        # SAVE IMAGE
        # =================================

        image_path = (

            f"uploads/{file.filename}"
        )

        with open(

            image_path,

            "wb"

        ) as buffer:

            buffer.write(

                await file.read()
            )

        # =================================
        # AI VERIFICATION
        # =================================

        ai_result = verify_tablet_logic(

            patient_id=
            reminder.patient_id,

            image_path=
            image_path,

            db=db
        )

        print(ai_result)

        # =================================
        # MATCH CHECK
        # =================================

        matched = (

            ai_result["status"]
            == "Correct Medicine"

            and

            ai_result["medicine_name"]
            .lower()
            .replace(" ", "")
            .replace("_", "")

            ==

            reminder.medicine_name
            .lower()
            .replace(" ", "")
            .replace("_", "")
        )

        # =================================
        # UPDATE STATUS IF MATCHED
        # =================================

        if matched:

            reminder.status = "taken"

            reminder.medicine_verified = True

            db.commit()

            # ==========================
            # RESOLVE ACTIVE ALERTS
            # ==========================

            db.query(

                GuardianAlert

            ).filter(

                GuardianAlert.patient_id
                == reminder.patient_id,

                GuardianAlert.alert_message
                .contains(
                    reminder.medicine_name
                ),

                GuardianAlert.status
                == "ACTIVE"

            ).update({

                "status":
                "RESOLVED"

            })

            db.commit()

            db.refresh(reminder)

            print(

                f"{reminder.medicine_name} "
                f"marked TAKEN"

            )
        # =================================
        # FINAL RESPONSE
        # =================================

        return {

            # =============================
            # VERIFIED STATUS
            # =============================

            "verified":
            matched,

            # =============================
            # REMINDER STATUS
            # =============================

            "status":

                "taken"

                if matched

                else

                "pending",

            # =============================
            # RESPONSE MESSAGE
            # =============================

            "message":

                "Medicine matched successfully"

                if matched

                else

                "Wrong medicine detected",

            # =============================
            # AI PREDICTED MEDICINE
            # =============================

            "medicine_name":
            ai_result.get(
                "medicine_name",
                "Unknown"
            ),

            # =============================
            # AI CONFIDENCE
            # =============================

            "confidence_score":
            ai_result.get(
                "confidence_score",
                0
            ),

            # =============================
            # EXPECTED REMINDER MEDICINE
            # =============================

            "expected_medicine":
            reminder.medicine_name,

            # =============================
            # AI PREDICTION SOURCE
            # =============================

            "prediction_source":
            ai_result.get(
                "prediction_source",
                "Unknown"
            ),

            # =============================
            # PRESCRIPTION DETAILS
            # =============================

            "prescription_details":
            ai_result.get(
                "prescription_details",
                {}
            )
        }

    except Exception as e:

        print(
            "VERIFY ERROR =",
            e
        )

        return {

            "verified": False,

            "status":
            "failed",

            "error":
            str(e)
        }

    finally:

        if image_path and os.path.exists(image_path):

            os.remove(image_path)