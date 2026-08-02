from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.guardian_alert_model import (
    GuardianAlert
)
from app.models.user_model import User
# =====================================================
# ROUTER
# =====================================================

router = APIRouter(

    prefix="/guardian",

    tags=["Guardian Alerts"]
)

# =====================================================
# FETCH ALERTS
# =====================================================

@router.get("/alerts/{patient_id}")

def get_alerts(

    patient_id: int,

    db: Session = Depends(get_db)
):

    alerts = db.query(

        GuardianAlert

    ).filter(

        GuardianAlert.patient_id
        == patient_id,
        GuardianAlert.status
        == "ACTIVE"
    ).order_by(

        GuardianAlert.id.desc()

    ).limit(2).all()

    return alerts

# =====================================================
# FETCH ALERTS BY GUARDIAN EMAIL
# =====================================================

@router.get("/alerts-email/{email}")

def get_alerts_by_email(

    email: str,

    db: Session = Depends(get_db)

):

    patient = db.query(

        User

    ).filter(

        User.guardian_email == email

    ).first()

    if not patient:

        return []

    alerts = db.query(

        GuardianAlert

    ).filter(

        GuardianAlert.patient_id
        == patient.id,
        GuardianAlert.status
    == "ACTIVE"

    ).order_by(

        GuardianAlert.id.desc()

    ).all()

    return alerts
@router.get(
    "/alert-history-email/{email}"
)
def alert_history(

    email: str,

    db: Session = Depends(get_db)

):

    patient = db.query(
        User
    ).filter(
        User.guardian_email == email
    ).first()

    if not patient:

        return []

    alerts = db.query(

        GuardianAlert

    ).filter(

        GuardianAlert.patient_id
        == patient.id,
        GuardianAlert.status
    == "ACTIVE"


    ).order_by(

        GuardianAlert.id.desc()

    ).all()

    return alerts