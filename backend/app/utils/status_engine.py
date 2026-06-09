from datetime import datetime

from app.models.reminder_model import (
    Reminder
)

from app.utils.guardian_alert_engine import (
    update_guardian_alerts
)

# =====================================================
# UPDATE MISSED MEDICINES
# =====================================================

def update_missed_medicines(db):

    current_time = datetime.now()

    print(
        "Checking reminders at",
        current_time.strftime("%H:%M")
    )

    reminders = db.query(
        Reminder
    ).filter(

        Reminder.status == "pending"

    ).all()

    updated = False

    for reminder in reminders:

        try:

            # =====================================
            # CONVERT REMINDER TIME
            # =====================================

            scheduled = datetime.strptime(

                reminder.scheduled_time,

                "%H:%M"
            )

            scheduled = current_time.replace(

                hour=scheduled.hour,

                minute=scheduled.minute,

                second=0,

                microsecond=0
            )

            # =====================================
            # MINUTES PASSED
            # =====================================

            minutes_passed = (

                current_time - scheduled

            ).total_seconds() / 60

            # =====================================
            # MARK MISSED ONLY AFTER 15 MIN
            # =====================================

            if minutes_passed >= 15:

                reminder.status = "missed"

                print(

                    f"{reminder.medicine_name} "
                    f"marked MISSED"
                )

                # =================================
                # UPDATE GUARDIAN ALERTS
                # =================================

                update_guardian_alerts(

                    reminder,

                    db
                )

                updated = True

        except Exception as e:

            print(
                "STATUS ENGINE ERROR:",
                e
            )

    if updated:

        db.commit()