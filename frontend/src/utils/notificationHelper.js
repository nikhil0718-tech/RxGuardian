export const requestNotificationPermission = async () => {

    if (!("Notification" in window)) {

        alert(
            "Browser does not support notifications"
        );

        return false;
    }

    const permission = await Notification.requestPermission();

    return permission === "granted";
};

export const showMedicineNotification = (

    medicineName

) => {

    if (Notification.permission === "granted") {

        new Notification(

            "RxGuardian Medicine Reminder",

            {

                body:
                `Time to take ${medicineName}`,

                icon:
                "https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
            }
        );
    }
};