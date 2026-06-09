let reminderInterval = null;

// =========================================
// START MEDICINE REMINDER ENGINE
// =========================================

export const startMedicineReminderEngine = (

    medicines

) => {

    // =====================================
    // CLEAR OLD ENGINE
    // =====================================

    if (reminderInterval) {

        clearInterval(reminderInterval);
    }

    // =====================================
    // START ENGINE
    // =====================================

    reminderInterval = setInterval(() => {

        const now = new Date();

        medicines.forEach((medicine) => {

            // =================================
            // SKIP TAKEN
            // =================================

            if (

                medicine.status
                ?.toLowerCase() === "taken"

            ) {

                return;
            }

            // =================================
            // INITIALIZE
            // =================================

            if (

                medicine.notification_count ===
                undefined

            ) {

                medicine.notification_count = 0;
            }

            // =================================
            // PARSE TIME
            // =================================

            const [

                hour,

                minute

            ] = medicine.scheduled_time
                .split(":")
                .map(Number);

            const reminderTime = new Date();

            reminderTime.setHours(hour);

            reminderTime.setMinutes(minute);

            reminderTime.setSeconds(0);

            reminderTime.setMilliseconds(0);

            // =================================
            // DIFFERENCE
            // =================================

            const diffMinutes = (

                now - reminderTime

            ) / 1000 / 60;

            console.log(

                medicine.medicine_name,

                "Diff:",

                diffMinutes,

                "Count:",

                medicine.notification_count
            );

            // =================================
            // REMINDER 1
            // =================================

            if (

                diffMinutes >= 0

                &&

                diffMinutes < 5

                &&

                medicine.notification_count === 0
            ) {

                showNotification(

                    medicine.medicine_name,

                    "Reminder 1"
                );

                medicine.notification_count = 1;

                console.log(
                    "Reminder 1 Sent"
                );
            }

            // =================================
            // REMINDER 2
            // =================================

            else if (

                diffMinutes >= 5

                &&

                diffMinutes < 10

                &&

                medicine.notification_count === 1
            ) {

                showNotification(

                    medicine.medicine_name,

                    "Reminder 2"
                );

                medicine.notification_count = 2;

                console.log(
                    "Reminder 2 Sent"
                );
            }

            // =================================
            // REMINDER 3
            // =================================

            else if (

                diffMinutes >= 10

                &&

                diffMinutes < 15

                &&

                medicine.notification_count === 2
            ) {

                showNotification(

                    medicine.medicine_name,

                    "Reminder 3"
                );

                medicine.notification_count = 3;

                console.log(
                    "Reminder 3 Sent"
                );
            }

            // =================================
            // MARK MISSED
            // =================================

            else if (

                diffMinutes >= 15

                &&

                medicine.status
                ?.toLowerCase() !== "taken"

                &&

                medicine.status
                ?.toLowerCase() !== "missed"
            ) {

                medicine.status = "missed";

                console.log(

                    `${medicine.medicine_name} marked MISSED`
                );
            }

        });

    }, 30000);
};

// =========================================
// STOP ENGINE
// =========================================

export const stopMedicineReminderEngine = () => {

    if (reminderInterval) {

        clearInterval(reminderInterval);

        reminderInterval = null;
    }
};

// =========================================
// SHOW NOTIFICATION
// =========================================

const showNotification = (

    medicineName,

    reminderType

) => {

    if (

    Notification.permission ===
    "granted"
) {

    navigator.serviceWorker
    .ready

    .then((registration) => {

        registration.showNotification(

            "RxGuardian Medicine Reminder",

            {

                body:
                `Time to take ${medicine.medicine_name}`,

                icon:
                "https://cdn-icons-png.flaticon.com/512/2966/2966486.png",

                badge:
                "https://cdn-icons-png.flaticon.com/512/2966/2966486.png",

                vibrate:
                [200, 100, 200],

                tag:
                `medicine-${medicine.id}`,

                renotify: true
            }
        );
    });
}
};