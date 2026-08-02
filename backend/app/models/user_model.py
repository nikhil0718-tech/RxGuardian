from sqlalchemy import Column, Integer, String

from app.config.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        nullable=False
    )

    # =====================================
    # GUARDIAN DETAILS
    # =====================================

    guardian_name = Column(
        String,
        nullable=True
    )

    guardian_email = Column(
        String,
        nullable=True
    )

    guardian_phone = Column(
        String,
        nullable=True
    )