from sqlalchemy import text

from app.config.database import engine

from app.models.user_model import User
from app.models.prescription_model import Prescription
from app.models.reminder_model import Reminder
from app.models.prescription_session_model import PrescriptionSession
from app.models.guardian_alert_model import GuardianAlert

from app.config.database import Base

# =====================================
# RESET DATABASE
# =====================================

with engine.connect() as conn:

    conn.execute(
        text(
            "DROP SCHEMA public CASCADE;"
        )
    )

    conn.execute(
        text(
            "CREATE SCHEMA public;"
        )
    )

    conn.commit()

print("Database Reset Successful")

# =====================================
# CREATE ALL TABLES
# =====================================

Base.metadata.create_all(bind=engine)

print("All Tables Created Successfully")