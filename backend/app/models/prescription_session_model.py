from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from app.config.database import Base

class PrescriptionSession(Base):

    __tablename__ = "prescription_sessions"

    id = Column(

        Integer,

        primary_key=True,

        index=True
    )

    patient_id = Column(
        Integer
    )

    doctor_name = Column(
        String
    )

    disease = Column(
        String
    )

    created_at = Column(

        DateTime,

        default=datetime.utcnow
    )