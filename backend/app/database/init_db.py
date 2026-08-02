from app.config.database import (
    engine,
    Base
)

from app.models.user_model import User

from app.models.prescription_model import (
    Prescription
)

from app.models.reminder_model import (
    Reminder
)

from app.models.adherence_model import (
    Adherence
)

from app.models.risk_model import (
    RiskStatus
)

from app.models.guardian_alert_model import (
    GuardianAlert
)

print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully")