from datetime import datetime
from datetime import timedelta

from app.models.guardian_alert_model import (
    GuardianAlert
)

def cleanup_old_alerts(db):

    cutoff = datetime.now() - timedelta(
        hours=24
    )

    deleted = db.query(

        GuardianAlert

    ).filter(

        GuardianAlert.status
        == "RESOLVED",

        GuardianAlert.created_at
        < cutoff

    ).delete()

    db.commit()

    print(
        f"Deleted {deleted} resolved alerts"
    )