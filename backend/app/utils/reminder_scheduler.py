from apscheduler.schedulers.background import (
    BackgroundScheduler
)

from datetime import datetime

from app.config.database import SessionLocal

from app.models.reminder_model import Reminder

# ============================================
# ADD THIS IMPORT
# ============================================

from app.utils.guardian_alert_engine import (
    update_guardian_alerts
)
from app.utils.alert_cleanup import (
    cleanup_old_alerts
)

# =====================================================
# CHECK REMINDERS
# =====================================================

def check_reminders():

    db = SessionLocal()

    try:

        current_time = datetime.now()

        current_str = current_time.strftime(
            "%H:%M"
        )

        print(
            f"Checking reminders at {current_str}"
        )

        reminders = db.query(Reminder).all()

        for reminder in reminders:

            # =========================================
            # SKIP TAKEN
            # =========================================

            if reminder.status == "taken":

                continue

            try:

                # =====================================
                # PARSE 24-HOUR FORMAT
                # =====================================

                reminder_time = datetime.strptime(

                    reminder.scheduled_time,

                    "%H:%M"
                )

                reminder_time = current_time.replace(

                    hour=reminder_time.hour,

                    minute=reminder_time.minute,

                    second=0,

                    microsecond=0
                )

                # =====================================
                # DIFFERENCE
                # =====================================

                diff_minutes = (

                    current_time - reminder_time

                ).total_seconds() / 60

                # =====================================
                # NOTIFICATION 1
                # =====================================

                if (

                    0 <= diff_minutes < 5

                    and

                    reminder.notification_count == 0
                ):

                    print(

                        f"Notification 1 → "
                        f"{reminder.medicine_name}"
                    )

                    reminder.notification_count = 1

                # =====================================
                # NOTIFICATION 2
                # =====================================

                elif (

                    5 <= diff_minutes < 10

                    and

                    reminder.notification_count == 1
                ):

                    print(

                        f"Notification 2 → "
                        f"{reminder.medicine_name}"
                    )

                    reminder.notification_count = 2

                # =====================================
                # NOTIFICATION 3
                # =====================================

                elif (

                    10 <= diff_minutes < 15

                    and

                    reminder.notification_count == 2
                ):

                    print(

                        f"Notification 3 → "
                        f"{reminder.medicine_name}"
                    )

                    reminder.notification_count = 3

                # =====================================
                # MARK MISSED
                # =====================================

                elif diff_minutes >= 15:

                    if reminder.status not in [

                        "taken",

                        "missed"
                    ]:

                        reminder.status = "missed"

                        reminder.guardian_notified = True

                        print(

                            f"Marked MISSED → "
                            f"{reminder.medicine_name}"
                        )

                        # =====================================
                        # UPDATE GUARDIAN ALERTS
                        # =====================================

                        update_guardian_alerts(

                            reminder,

                            db
                        )

            except Exception as e:

                print(
                    "TIME FORMAT ERROR:",
                    e
                )

        db.commit()
        cleanup_old_alerts(db)
    except Exception as e:

        print(
            "Scheduler Error:",
            e
        )

    finally:

        db.close()

# =====================================================
# START SCHEDULER
# =====================================================

def start_scheduler():

    scheduler = BackgroundScheduler()

    scheduler.add_job(

        check_reminders,

        "interval",

        seconds=30
    )

    scheduler.start()

    print(
        "Advanced Reminder Scheduler Started"
    )