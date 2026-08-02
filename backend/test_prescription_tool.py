from app.config.database import SessionLocal

from app.tools.prescription_tool import (
    execute
)

db = SessionLocal()

result = execute(

    db=db,

    patient_id=1
)

print(result)