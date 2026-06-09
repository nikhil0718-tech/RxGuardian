from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime
)

from app.config.database import Base


class GuardianAlert(Base):

    __tablename__ = "guardian_alerts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        nullable=False
    )

    alert_message = Column(
        String,
        nullable=False
    )

    risk_level = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="ACTIVE"
    )

    created_at = Column(
        DateTime
    )