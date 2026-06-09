from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from datetime import datetime

from app.config.database import Base


class Prescription(Base):

    __tablename__ = "prescriptions"

    # =====================================
    # PRIMARY KEY
    # =====================================

    id = Column(

        Integer,

        primary_key=True,

        index=True
    )

    # =====================================
    # PRESCRIPTION SESSION
    # =====================================

    session_id = Column(

        Integer,

        ForeignKey(
            "prescription_sessions.id"
        )
    )

    # =====================================
    # DOCTOR
    # =====================================

    doctor_id = Column(

        Integer,

        ForeignKey("users.id")
    )

    # =====================================
    # PATIENT
    # =====================================

    patient_id = Column(

        Integer,

        ForeignKey("users.id")
    )

    # =====================================
    # MEDICINE
    # =====================================

    medicine_name = Column(

        String,

        nullable=False
    )

    dosage = Column(

        String,

        nullable=False
    )

    frequency = Column(

        String,

        nullable=False
    )

    duration = Column(

        String,

        nullable=False
    )

    timing = Column(

        String,

        nullable=False
    )

    scheduled_time = Column(
        String,
        nullable=True
    )

    # =====================================
    # CREATED DATE
    # =====================================

    created_at = Column(

        DateTime,

        default=datetime.utcnow
    )