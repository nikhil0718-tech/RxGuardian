from app.config.database import (
    SessionLocal
)

from app.tools.reminder_tool import (
    execute
)

db = SessionLocal()

print(

    execute(

        db,

        patient_id=1

    )
)