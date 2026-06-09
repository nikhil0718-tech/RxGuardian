from datetime import datetime

from app.models.guardian_alert_model import (
    GuardianAlert
)

from app.models.reminder_model import (
    Reminder
)

# =====================================================
# CREATE GUARDIAN ALERT
# =====================================================

def create_guardian_alert(

    patient_id,
    message,
    risk_level,
    db
):

    try:

        # =================================
        # CREATE ALERT
        # =================================

        alert = GuardianAlert(

            patient_id=patient_id,

            alert_message=message,

            risk_level=risk_level
        )

        db.add(alert)

        db.commit()

        db.refresh(alert)

        print(
            "Guardian alert created"
        )

        return alert

    except Exception as e:

        print(
            "GUARDIAN ALERT ERROR:",
            e
        )

# =====================================================
# UPDATE ALERTS
# =====================================================

def update_guardian_alerts(

    reminder,
    db
):

    print(

        f"Updating guardian alerts "
        f"for patient "
        f"{reminder.patient_id}"
    )

    # =========================================
    # CURRENT DATE & TIME
    # =========================================

    current_date = datetime.now().strftime(

        "%d-%m-%Y"
    )

    current_time = datetime.now().strftime(

        "%I:%M %p"
    )

    # =========================================
    # ALERT MESSAGE
    # =========================================

    new_message = (

        f"Medicine: "
        f"{reminder.medicine_name}\n\n"

        f"Scheduled Time: "
        f"{reminder.scheduled_time}\n\n"

        f"Missed At: "
        f"{current_time}\n\n"

        f"Date: "
        f"{current_date}"
    )

    print(
        new_message
    )

    # =========================================
    # CHECK EXISTING ACTIVE ALERT
    # =========================================

    existing_alert = db.query(

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

    ).first()

    # =========================================
    # AVOID DUPLICATE ACTIVE ALERTS
    # =========================================

    if existing_alert:

        print(

            f"Active alert already exists "
            f"for {reminder.medicine_name}"

        )

        return

    # =========================================
    # CREATE NEW ALERT
    # =========================================

    create_guardian_alert(

        patient_id=
        reminder.patient_id,

        message=
        new_message,

        risk_level=
        "High",

        db=db
    )