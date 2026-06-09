from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.risk_model import (
    RiskStatus
)

router = APIRouter(
    prefix="/risk",
    tags=["Risk Evaluation"]
)


@router.get("/patient/{patient_id}")
def get_patient_risk(

    patient_id: int,

    db: Session = Depends(get_db)
):

    risk = db.query(RiskStatus).filter(
        RiskStatus.patient_id == patient_id
    ).first()

    return risk