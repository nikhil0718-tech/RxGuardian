from app.models.reminder_model import (
    Reminder
)

# =====================================================
# CALCULATE ADHERENCE
# =====================================================

def calculate_adherence(

    patient_id,
    db
):

    reminders = db.query(
        Reminder
    ).filter(

        Reminder.patient_id
        == patient_id

    ).all()

    if not reminders:

        return 0

    taken_count = len([

        reminder for reminder in reminders

        if reminder.status == "taken"
    ])

    adherence = (

        taken_count / len(reminders)

    ) * 100

    return round(adherence, 2)