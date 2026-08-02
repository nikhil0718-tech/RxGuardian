from sqlalchemy.orm import Session

from app.models.adherence_model import (
    Adherence
)

def execute(
    db: Session,
    patient_id: int
):

    logs = (

        db.query(
            Adherence
        )

        .filter(

            Adherence.patient_id
            == patient_id

        )

        .all()
    )

    if not logs:

        return {
            "total": 0,
            "taken": 0,
            "missed": 0,
            "adherence": 0
        }

    total = len(logs)

    taken = len([
        log
        for log in logs
        if log.status.lower() == "taken"
    ])

    missed = len([
        log
        for log in logs
        if log.status.lower() == "missed"
    ])

    adherence = round(

        (taken / total) * 100,

        2

    )

    return {

        "total": total,

        "taken": taken,

        "missed": missed,

        "adherence": adherence

    }