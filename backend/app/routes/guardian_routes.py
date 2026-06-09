from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from fastapi.responses import FileResponse

from app.config.database import get_db

from app.models.reminder_model import (
    Reminder
)

from app.models.guardian_alert_model import (
    GuardianAlert
)

from app.models.user_model import User

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)

# =====================================================
# ROUTER
# =====================================================

router = APIRouter(

    prefix="/guardian",

    tags=["Guardian"]
)

# =====================================================
# PATIENT STATUS
# =====================================================

@router.get("/patient-status/{patient_id}")

def patient_status(

    patient_id: int,

    db: Session = Depends(get_db)
):

    reminders = db.query(
        Reminder
    ).filter(

        Reminder.patient_id
        == patient_id

    ).all()

    result = []

    for reminder in reminders:

        result.append({

            "medicine_name":
            reminder.medicine_name,

            "scheduled_time":
            reminder.scheduled_time,

            "status":
            reminder.status
        })

    return result

# =====================================================
# PATIENT STATUS HELPER
# =====================================================

def get_patient_status(

    patient_id: int,

    db: Session = Depends(get_db)
):

    return patient_status(

        patient_id,

        db
    )

# =====================================================
# PATIENT STATUS BY EMAIL
# =====================================================

@router.get("/patient-status-email/{email}")

def get_patient_status_by_email(

    email: str,

    db: Session = Depends(get_db)
):

    patient = db.query(

        User

    ).filter(

        User.guardian_email == email

    ).first()

    if not patient:

        return []

    return get_patient_status(

        patient.id,

        db
    )

# =====================================================
# GUARDIAN REPORT
# =====================================================

@router.get("/reports/{patient_id}")

def guardian_report(

    patient_id: int,

    db: Session = Depends(get_db)
):

    reminders = db.query(
        Reminder
    ).filter(

        Reminder.patient_id
        == patient_id

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

    pending = len([

        reminder

        for reminder in reminders

        if reminder.status == "pending"
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

    # =====================================
    # RISK LEVEL
    # =====================================

    if taken == 0 and missed == 0:

        risk = "MONITORING"

    elif adherence >= 80:

        risk = "LOW"

    elif adherence >= 50:

        risk = "MEDIUM"

    else:

        risk = "HIGH"

    return {

        "total_medicines":
        total,

        "taken_medicines":
        taken,

        "missed_medicines":
        missed,

        "pending_medicines":
        pending,

        "adherence_percentage":
        adherence,

        "risk_level":
        risk
    }

# =====================================================
# GET GUARDIAN ALERTS
# =====================================================

@router.get("/alerts/{patient_id}")

def get_guardian_alerts(

    patient_id: int,

    db: Session = Depends(get_db)
):

    alerts = db.query(
        GuardianAlert
    ).filter(

        GuardianAlert.patient_id
        == patient_id

    ).all()

    result = []

    for alert in alerts:

        result.append({

            "id":
            alert.id,

            "patient_id":
            alert.patient_id,

            "alert_message":
            alert.alert_message,

            "risk_level":
            alert.risk_level
        })

    return result

# =====================================================
# TEST ALERT
# =====================================================

@router.get("/test-alert/{patient_id}")

def test_alert(

    patient_id: int,

    db: Session = Depends(get_db)
):

    alert = GuardianAlert(

        patient_id=
        patient_id,

        alert_message=
        "Patient missed medicine",

        risk_level=
        "High"
    )

    db.add(alert)

    db.commit()

    return {

        "message":
        "Guardian Alert Created"
    }

# =====================================================
# DOWNLOAD PDF REPORT
# =====================================================

@router.get("/download-report/{patient_id}")

def download_report(

    patient_id: int,

    db: Session = Depends(get_db)
):

    reminders = db.query(
        Reminder
    ).filter(

        Reminder.patient_id
        == patient_id

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

    pending = len([

        reminder

        for reminder in reminders

        if reminder.status == "pending"
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

    # =====================================
    # RISK LEVEL
    # =====================================

    if taken == 0 and missed == 0:

        risk = "MONITORING"

    elif adherence >= 80:

        risk = "LOW"

    elif adherence >= 50:

        risk = "MEDIUM"

    else:

        risk = "HIGH"

    # =====================================
    # PDF FILE
    # =====================================

    filename = f"patient_{patient_id}_report.pdf"

    doc = SimpleDocTemplate(
        filename
    )

    styles = getSampleStyleSheet()

    elements = []

    # =====================================
    # TITLE
    # =====================================

    elements.append(

        Paragraph(

            "RxGuardian Patient Report",

            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 20)
    )

    # =====================================
    # REPORT DATA
    # =====================================

    report_data = [

        f"Total Medicines: {total}",

        f"Taken Medicines: {taken}",

        f"Missed Medicines: {missed}",

        f"Pending Medicines: {pending}",

        f"Adherence Percentage: {adherence}%",

        f"Risk Level: {risk}"
    ]

    for item in report_data:

        elements.append(

            Paragraph(

                item,

                styles["BodyText"]
            )
        )

        elements.append(
            Spacer(1, 12)
        )

    # =====================================
    # BUILD PDF
    # =====================================

    doc.build(elements)

    return FileResponse(

        path=filename,

        filename=filename,

        media_type="application/pdf"
    )

# =====================================================
# REPORTS BY EMAIL
# =====================================================

@router.get("/reports-email/{email}")

def get_reports_by_email(

    email: str,

    db: Session = Depends(get_db)
):

    patient = db.query(

        User

    ).filter(

        User.guardian_email == email

    ).first()

    if not patient:

        return {

            "message":
            "Patient not found"
        }

    return guardian_report(

        patient.id,

        db
    )

# =====================================================
# GUARDIAN PROFILE BY EMAIL
# =====================================================

@router.get("/profile-email/{email}")

def get_guardian_profile(

    email: str,

    db: Session = Depends(get_db)
):

    patient = db.query(

        User

    ).filter(

        User.guardian_email == email

    ).first()

    if not patient:

        return {

            "message":
            "Patient not found"
        }

    return {

        "patient_name":
        patient.name,

        "patient_email":
        patient.email,

        "guardian_name":
        patient.guardian_name,

        "guardian_email":
        patient.guardian_email,

        "guardian_phone":
        patient.guardian_phone
    }

# =====================================================
# ALERTS BY EMAIL
# =====================================================

@router.get("/alerts-email/{email}")

def get_alerts_by_email(

    email: str,

    db: Session = Depends(get_db)

):

    patient = db.query(

        User

    ).filter(

        User.guardian_email == email

    ).first()

    if not patient:

        return []

    alerts = db.query(

        GuardianAlert

    ).filter(

        GuardianAlert.patient_id
        == patient.id,

        GuardianAlert.status
        == "ACTIVE"

    ).order_by(

        GuardianAlert.id.desc()

    ).all()

    return alerts