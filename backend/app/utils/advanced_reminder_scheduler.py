from datetime import datetime

from app.models.reminder_model import (
    Reminder
)

from app.utils.guardian_alert_engine import (
    create_guardian_alert
)

# =====================================================
# PROCESS REMINDERS
# =====================================================

def process_reminders(db):

    reminders = db.query(
        Reminder
    ).filter(

        Reminder.status == "pending"

    ).all()

    current_time = datetime.now()

    print(
        f"Checking reminders at "
        f"{current_time.strftime('%H:%M')}"
    )

    for reminder in reminders:

        try:

            # =================================
            # CONVERT SCHEDULED TIME
            # =================================

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

            # =================================
            # TIME DIFFERENCE
            # =================================

            minutes_passed = (

                current_time - scheduled

            ).total_seconds() / 60

            # =================================
            # BEFORE MEDICINE TIME
            # =================================

            if minutes_passed < 0:

                continue

            # =================================
            # 1ST REMINDER
            # =================================

            if (

                0 <= minutes_passed < 5

                and

                reminder.notification_count == 0
            ):

                print(

                    f"1st Reminder: "
                    f"{reminder.medicine_name}"
                )

                reminder.notification_count = 1

                db.commit()

            # =================================
            # 2ND REMINDER
            # =================================

            elif (

                5 <= minutes_passed < 10

                and

                reminder.notification_count == 1
            ):

                print(

                    f"2nd Reminder: "
                    f"{reminder.medicine_name}"
                )

                reminder.notification_count = 2

                db.commit()

            # =================================
            # 3RD REMINDER
            # =================================

            elif (

                10 <= minutes_passed < 15

                and

                reminder.notification_count == 2
            ):

                print(

                    f"3rd Reminder: "
                    f"{reminder.medicine_name}"
                )

                reminder.notification_count = 3

                db.commit()

            # =================================
            # FINAL MISSED LOGIC
            # =================================

            elif (

                minutes_passed >= 15

                and

                reminder.notification_count >= 3

                and

                reminder.status == "pending"
            ):

                reminder.status = "missed"

                reminder.guardian_notified = True

                print(

                    f"{reminder.medicine_name} "
                    f"marked MISSED"
                )

                create_guardian_alert(

                    patient_id=
                    reminder.patient_id,

                    message=
                    f"Missed medicine: "
                    f"{reminder.medicine_name}",

                    risk_level="High",

                    db=db
                )

                db.commit()

        except Exception as e:

            print(
                "REMINDER ERROR:",
                e
            )