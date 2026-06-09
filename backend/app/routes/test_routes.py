from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.utils.guardian_alert_engine import (
    update_guardian_alerts
)

router = APIRouter(

    tags=["Test"]
)

# =====================================================
# TEST GUARDIAN ALERT
# =====================================================

@router.get("/test/guardian-alert/{patient_id}")

def test_guardian_alert(

    patient_id: int,

    db: Session = Depends(get_db)
):

    update_guardian_alerts(

        patient_id,

        db
    )

    return {

        "message":
        "Guardian Alert Engine Tested"
    }