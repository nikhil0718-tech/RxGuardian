from sqlalchemy import text

from app.config.database import engine


def add_reminder_date_column():

    with engine.begin() as connection:

        connection.execute(
            text(
                """
                ALTER TABLE reminders
                ADD COLUMN IF NOT EXISTS reminder_date DATE;
                """
            )
        )

    print(
        "Database migration completed: "
        "reminder_date column is ready."
    )


if __name__ == "__main__":

    add_reminder_date_column()