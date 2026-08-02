from sqlalchemy.orm import Session

from app.models.adherence_model import (
    Adherence
)

from app.models.risk_model import (
    RiskStatus
)

from app.models.guardian_alert_model import (
    GuardianAlert
)


def evaluate_patient_risk(
    patient_id: int,
    db: Session
):

    missed_count = db.query(
        Adherence
    ).filter(
        Adherence.patient_id == patient_id,
        Adherence.status == "missed"
    ).count()

    risk_level = "Low"

    recommendation = "Healthy adherence"

    if missed_count >= 3:

        risk_level = "Medium"

        recommendation = (
            "Patient missing medicines frequently"
        )

    if missed_count >= 5:

        risk_level = "High"

        recommendation = (
            "Guardian intervention required"
        )

    existing_risk = db.query(
        RiskStatus
    ).filter(
        RiskStatus.patient_id == patient_id
    ).first()

    if existing_risk:

        existing_risk.total_missed = missed_count

        existing_risk.risk_level = risk_level

        existing_risk.recommendation = recommendation

    else:

        new_risk = RiskStatus(

            patient_id=patient_id,

            total_missed=missed_count,

            risk_level=risk_level,

            recommendation=recommendation
        )

        db.add(new_risk)

    db.commit()

    # CREATE ALERT IF HIGH RISK

    if risk_level == "High":

        alert = GuardianAlert(

            patient_id=patient_id,

            alert_message=message,

            risk_level=risk_level
        )

        db.add(alert)

        db.commit()