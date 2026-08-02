from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy import Boolean

from datetime import datetime

from app.config.database import Base

# =====================================================
# REMINDER MODEL
# =====================================================

class Reminder(Base):

    __tablename__ = "reminders"

    # =====================================
    # PRIMARY KEY
    # =====================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =====================================
    # RELATIONS
    # =====================================

    patient_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    prescription_id = Column(
        Integer,
        ForeignKey("prescriptions.id"),
        nullable=False
    )

    # =====================================
    # MEDICINE DETAILS
    # =====================================

    medicine_name = Column(
        String,
        nullable=False
    )

    scheduled_time = Column(
        String,
        nullable=False
    )

    # =====================================
    # REMINDER STATUS
    # =====================================

    status = Column(
        String,
        default="pending"
    )

    # =====================================
    # SMART REMINDER ENGINE
    # =====================================

    # 0 = no reminder
    # 1 = first reminder sent
    # 2 = second reminder sent
    # 3 = final reminder sent

    notification_count = Column(
        Integer,
        default=0
    )

    # =====================================
    # GUARDIAN ESCALATION
    # =====================================

    guardian_notified = Column(
        Boolean,
        default=False
    )

    # =====================================
    # AI TRACKING
    # =====================================

    medicine_verified = Column(
        Boolean,
        default=False
    )

    # =====================================
    # TIMESTAMPS
    # =====================================

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )