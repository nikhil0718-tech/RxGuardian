from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.prescription_model import (
    Prescription
)

from app.models.prescription_session_model import (
    PrescriptionSession
)

from app.models.reminder_model import (
    Reminder
)

from app.models.user_model import (
    User
)

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from reportlab.lib import colors

from reportlab.lib.styles import (
    getSampleStyleSheet
)

# =====================================================
# ROUTER
# =====================================================

router = APIRouter(

    prefix="/prescriptions",

    tags=["Prescriptions"]
)

# =====================================================
# CREATE PRESCRIPTION SESSION
# =====================================================

@router.post("/create-session")

def create_prescription_session(

    data: dict,

    db: Session = Depends(get_db)
):

    # =====================================
    # CREATE SESSION
    # =====================================

    patient = db.query(

        User

    ).filter(

        User.email ==
        data["patient_email"]

    ).first()

    if not patient:

        raise HTTPException(

            status_code=404,

            detail="Patient not found"
        )

    patient_id = patient.id

    session = PrescriptionSession(

        patient_id=patient_id,

        doctor_name=data["doctor_name"],

        disease=data["disease"]
    )

    db.add(session)

    db.commit()

    db.refresh(session)

    medicines = data["medicines"]

    # =====================================
    # CREATE MEDICINES + REMINDERS
    # =====================================

    for medicine in medicines:

        # =================================
        # CREATE PRESCRIPTION
        # =================================

        prescription = Prescription(

            session_id=session.id,

            patient_id=patient_id,

            medicine_name=
            medicine["medicine_name"],

            dosage=
            medicine["dosage"],

            frequency=
            medicine["frequency"],

            duration=
            medicine["duration"],

            timing=
            medicine["timing"],

            scheduled_time=
            medicine["scheduled_time"]
        )

        db.add(prescription)

        db.commit()

        db.refresh(prescription)

        # =================================
        # CREATE SMART REMINDER
        # =================================

        reminder = Reminder(

            patient_id=patient_id,

            prescription_id=
            prescription.id,

            medicine_name=
            medicine["medicine_name"],

            scheduled_time=
            medicine["scheduled_time"],

            status="pending",

            notification_count=0,

            guardian_notified=False
        )

        db.add(reminder)

        db.commit()

        db.refresh(reminder)

        print(

            f"Reminder Created -> "
            f"{reminder.medicine_name}"
        )

    return {

        "message":
        "Prescription + reminders created successfully",

        "session_id":
        session.id
    }

# =====================================================
# GET PATIENT PRESCRIPTIONS
# =====================================================

@router.get("/patient/{patient_id}")

def get_patient_prescriptions(

    patient_id: int,

    db: Session = Depends(get_db)
):

    sessions = db.query(
        PrescriptionSession
    ).filter(

        PrescriptionSession.patient_id
        == patient_id

    ).order_by(

        PrescriptionSession.created_at.desc()

    ).all()

    result = []

    for session in sessions:

        medicines = db.query(
            Prescription
        ).filter(

            Prescription.session_id
            == session.id

        ).all()

        medicine_data = []

        for medicine in medicines:

            medicine_data.append({

                "medicine_name":
                medicine.medicine_name,

                "dosage":
                medicine.dosage,

                "frequency":
                medicine.frequency,

                "duration":
                medicine.duration,

                "timing":
                medicine.timing,

                "scheduled_time":
                medicine.scheduled_time
            })

        result.append({

            "session_id":
            session.id,

            "doctor_name":
            session.doctor_name,

            "disease":
            session.disease,

            "created_at":
            session.created_at,

            "medicines":
            medicine_data
        })

    return result

# =====================================================
# GET PATIENT PRESCRIPTIONS BY EMAIL
# =====================================================

@router.get("/patient-email/{email}")

def get_patient_prescriptions_by_email(

    email: str,

    db: Session = Depends(get_db)
):

    patient = db.query(
        User
    ).filter(
        User.email == email
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    sessions = db.query(
        PrescriptionSession
    ).filter(
        PrescriptionSession.patient_id
        == patient.id
    ).order_by(
        PrescriptionSession.created_at.desc()
    ).all()

    result = []

    for session in sessions:

        medicines = db.query(
            Prescription
        ).filter(
            Prescription.session_id
            == session.id
        ).all()

        medicine_data = []

        for medicine in medicines:

            medicine_data.append({

                "medicine_name":
                medicine.medicine_name,

                "dosage":
                medicine.dosage,

                "frequency":
                medicine.frequency,

                "duration":
                medicine.duration,

                "timing":
                medicine.timing,

                "scheduled_time":
                medicine.scheduled_time
            })

        result.append({

            "session_id":
            session.id,

            "doctor_name":
            session.doctor_name,

            "disease":
            session.disease,

            "created_at":
            session.created_at,

            "medicines":
            medicine_data
        })

    return result

# =====================================================
# DOWNLOAD PRESCRIPTION PDF
# =====================================================

@router.get("/download/session/{session_id}")

def download_session_prescription(

    session_id: int,

    db: Session = Depends(get_db)
):

    # =====================================
    # FETCH SESSION
    # =====================================

    session = db.query(
        PrescriptionSession
    ).filter(

        PrescriptionSession.id
        == session_id

    ).first()

    if not session:

        return {

            "message":
            "Session not found"
        }

    # =====================================
    # FETCH PATIENT
    # =====================================

    patient = db.query(
        User
    ).filter(

        User.id
        == session.patient_id

    ).first()

    # =====================================
    # FETCH MEDICINES
    # =====================================

    prescriptions = db.query(
        Prescription
    ).filter(

        Prescription.session_id
        == session_id

    ).all()

    # =====================================
    # PDF FILE
    # =====================================

    filename = (

        f"session_"
        f"{session_id}_prescription.pdf"
    )

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

            "RxGuardian Medical Prescription",

            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 25)
    )

    # =====================================
    # DOCTOR
    # =====================================

    elements.append(

        Paragraph(

            f"<b>Doctor Name:</b> "
            f"{session.doctor_name}",

            styles["BodyText"]
        )
    )

    elements.append(
        Spacer(1, 10)
    )

    # =====================================
    # PATIENT INFO
    # =====================================

    elements.append(

        Paragraph(

            f"<b>Patient Name:</b> "
            f"{patient.name}",

            styles["BodyText"]
        )
    )

    elements.append(
        Spacer(1, 8)
    )

    elements.append(

        Paragraph(

            f"<b>Patient Email:</b> "
            f"{patient.email}",

            styles["BodyText"]
        )
    )

    elements.append(
        Spacer(1, 8)
    )

    elements.append(

        Paragraph(

            f"<b>Patient ID:</b> "
            f"{session.patient_id}",

            styles["BodyText"]
        )
    )

    elements.append(
        Spacer(1, 12)
    )

    # =====================================
    # DISEASE
    # =====================================

    elements.append(

        Paragraph(

            f"<b>Disease:</b> "
            f"{session.disease}",

            styles["BodyText"]
        )
    )

    elements.append(
        Spacer(1, 25)
    )

    # =====================================
    # TABLE DATA
    # =====================================

    data = [[

        "Medicine",

        "Dosage",

        "Frequency",

        "Duration",

        "Timing",

        "Reminder Time"
    ]]

    for prescription in prescriptions:

        data.append([

            prescription.medicine_name,

            prescription.dosage,

            prescription.frequency,

            prescription.duration,

            prescription.timing,

            prescription.scheduled_time
        ])

    # =====================================
    # TABLE
    # =====================================

    table = Table(data)

    table.setStyle(

        TableStyle([

            (
                'BACKGROUND',
                (0, 0),
                (-1, 0),
                colors.HexColor("#2563EB")
            ),

            (
                'TEXTCOLOR',
                (0, 0),
                (-1, 0),
                colors.white
            ),

            (
                'GRID',
                (0, 0),
                (-1, -1),
                1,
                colors.black
            ),

            (
                'FONTNAME',
                (0, 0),
                (-1, 0),
                'Helvetica-Bold'
            ),

            (
                'BOTTOMPADDING',
                (0, 0),
                (-1, 0),
                12
            ),

            (
                'BACKGROUND',
                (0, 1),
                (-1, -1),
                colors.whitesmoke
            )
        ])
    )

    elements.append(table)

    elements.append(
        Spacer(1, 45)
    )

    # =====================================
    # SIGNATURE
    # =====================================

    elements.append(

        Paragraph(

            "Doctor Signature: ____________________",

            styles["BodyText"]
        )
    )

    elements.append(
        Spacer(1, 25)
    )

    # =====================================
    # FOOTER
    # =====================================

    elements.append(

        Paragraph(

            "RxGuardian Healthcare System",

            styles["Italic"]
        )
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