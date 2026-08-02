from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from datetime import datetime

from app.config.database import Base


class RiskStatus(Base):

    __tablename__ = "risk_status"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    total_missed = Column(
        Integer,
        default=0
    )

    risk_level = Column(
        String,
        default="Low"
    )

    recommendation = Column(
        String,
        default="Healthy adherence"
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow
    )