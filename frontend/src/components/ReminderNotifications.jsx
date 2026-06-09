import { useEffect, useRef } from "react";

import API from "../api/api";

const ReminderNotifications = () => {

    // =====================================
    // TRACK SHOWN NOTIFICATIONS
    // =====================================

    const shownNotifications = useRef([]);

    useEffect(() => {

        // =================================
        // CHECK REMINDERS
        // =================================

        const checkReminders = async () => {

            try {

                const response = await API.get(

                    "/reminders/patient/1"
                );

                const reminders = response.data;

                reminders.forEach((reminder) => {

                    // =============================
                    // ONLY PENDING REMINDERS
                    // =============================

                    if (

                        reminder.status !== "pending"
                    ) {

                        return;
                    }

                    // =============================
                    // UNIQUE KEY
                    // =============================

                    const uniqueKey = `

                        ${reminder.id}

                        -

                        ${reminder.notification_count}

                    `;

                    // =============================
                    // SHOW ONLY ONCE
                    // =============================

                    if (

                        reminder.notification_count > 0

                        &&

                        !shownNotifications.current.includes(

                            uniqueKey
                        )
                    ) {

                        shownNotifications.current.push(

                            uniqueKey
                        );

                        // =========================
                        // BROWSER NOTIFICATION
                        // =========================

                        if (

                            Notification.permission
                            ===
                            "granted"
                        ) {

                            new Notification(

                                "💊 RxGuardian Reminder",

                                {

                                    body:

                                    `Time to take ${reminder.medicine_name}`,

                                    icon:
                                    "/medicine.png"
                                }
                            );
                        }

                        console.log(

                            "Notification Sent:",

                            reminder.medicine_name
                        );
                    }
                });

            } catch (error) {

                console.log(

                    "Reminder Notification Error:",

                    error
                );
            }
        };

        // =================================
        // INITIAL CHECK
        // =================================

        checkReminders();

        // =================================
        // REPEAT EVERY 10 SECONDS
        // =================================

        const interval = setInterval(

            checkReminders,

            10000
        );

        return () => clearInterval(
            interval
        );

    }, []);

    return null;
};

export default ReminderNotifications;