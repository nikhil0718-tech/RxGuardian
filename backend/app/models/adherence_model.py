from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from datetime import datetime

from app.config.database import Base


class Adherence(Base):

    __tablename__ = "adherence_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    reminder_id = Column(
        Integer,
        ForeignKey("reminders.id")
    )

    medicine_name = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        nullable=False
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )