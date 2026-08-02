from app.services.query_router import classify_query

from app.rag.rag_service import ask_rag

from app.tools.prescription_tool import execute as prescription_tool

from app.tools.reminder_tool import execute as reminder_tool

from app.services.json_service import (
    JsonService
)

from app.services.medicine_extractor import (
    extract_medicine
)

from app.services.json_summary_service import (
    JsonSummaryService
)

from app.services.tool_summary_service import (
    ToolSummaryService
)
from app.services.assistant_service import (
    AssistantService
)

from app.services.general_medicine_extractor import (
    extract_unknown_medicine   )
from app.services.medicine_detector import (
    detect_medicines
)
from app.services.conversation_memory import (
    get_medicine,
    save_medicine,
    save_route,
    save_tool
)
from app.services.conversation_memory import (
    get_tool
)

class AssistantServiceV2:

    @staticmethod
    def ask_ai(
        session_id,
        message,
        user_id,
        db
    ):
        current_medicine = get_medicine(
    session_id
)
        print(
            "CURRENT MEDICINE:",
            current_medicine
        )



        
        routing_message = message

        if current_medicine:

            enhanced_message = f"""
        Current Medicine:
        {current_medicine}

        User Question:
        {message}
        """
        else:
            enhanced_message = message

        route = classify_query(
            routing_message
        )
        last_tool = get_tool(session_id)

        followup_keywords = [

            "time",
            "timing",
            "dosage",
            "frequency",
            "before food",
            "after food",
            "before meal",
            "after meal",
            "take it",
            "take this",
            "take this medicine",
            "when should i take",
            "when to take",
            "should i take it",
            "should i take this",
            "schedule",
            "scheduled time"
        ]

        is_followup = any(
            word in message.lower()
            for word in followup_keywords
        )

        if is_followup and last_tool in [
            "prescription",
            "reminder"
        ]:
            print(
                "FOLLOW-UP DETECTED →",
                last_tool
            )

            route = last_tool
        save_route(
            session_id,
            route
        )

        print(
            "ROUTE:",
            route
        )
        
        if route == "rag":
            print(
                "MESSAGE:",
                message
            )

            print(
                "ENHANCED:",
                enhanced_message
            )
            medicines = detect_medicines(message)
            print("DETECTED MEDICINES:", medicines)
            print("CURRENT MEDICINE:", current_medicine)

            if len(medicines) == 1:

                medicine = medicines[0]

                save_medicine(
                    session_id,
                    medicine
                )

                current_medicine = get_medicine(
                    session_id
                )

                enhanced_message = f"""
            Current Medicine:
            {current_medicine}

            User Question:
            {message}
            """

            elif len(medicines) > 1:

                print(
                    "MULTIPLE MEDICINES DETECTED:",
                    medicines
                )

                medicine = None

                # Do NOT update conversation memory

            else:

                medicine = extract_medicine(message)

                if not medicine:

                    medicine = current_medicine

                if medicine:

                    save_medicine(
                        session_id,
                        medicine
                    )
                    current_medicine = get_medicine(
                        session_id
                    )

                    enhanced_message = f"""
                    Current Medicine:
                    {current_medicine}

                    User Question:
                    {message}
                    """
            save_tool(
                session_id,
                "rag"
            )

            return ask_rag(
                enhanced_message
)

        elif route == "prescription":

            data = prescription_tool(
                db,
                user_id
            )
            medicines = detect_medicines(message)

            if len(medicines) == 1:

                save_medicine(
                    session_id,
                    medicines[0]
                )

                current_medicine = get_medicine(
                    session_id
                )
            query = message.lower()

            plural_queries = [

    # General prescription queries
    "prescriptions",
    "my prescriptions",
    "show prescriptions",
    "show my prescriptions",
    "list prescriptions",
    "current prescriptions",
    "active prescriptions",

    # Medicine list
    "medicines",
    "my medicines",
    "all medicines",
    "current medicines",
    "active medicines",
    "prescribed medicines",
    "medicine list",
    "show medicines",
    "show all medicines",
    "list medicines",

    # Today's medicines
    "today medicines",
    "today's medicines",
    "today medicine list",
    "today's medicine list",
    "today prescription",
    "today's prescription",
    "today prescriptions",
    "today's prescriptions",
    "today tablets",
    "today's tablets",
    "today drugs",
    "today's drugs",

    # Schedule
    "medicine schedule",
    "today medicine schedule",
    "today's medicine schedule",
    "today schedule",
    "today's schedule",

    # What should I take
    "what medicines should i take today",
    "what should i take today",
    "which medicines should i take today",
    "which medicines should i take",
    "what medicines are prescribed",
    "which medicines are prescribed",
    "what medicines do i have",
    "which medicines do i have",

    # Show/List queries
    "show today's medicines",
    "list today's medicines",
    "show today's prescription",
    "list today's prescription",
    "show current medicines",
    "list current medicines",
    "show active medicines",
    "list active medicines"
]
            is_plural = any(
                word in query
                for word in plural_queries
            )

            if current_medicine and not is_plural:

                filtered_data = []

                for item in data:

                    if (
                        item["medicine_name"]
                        .lower()
                        .replace(" ", "_")
                        ==
                        current_medicine \
    .lower() \
    .replace(" ", "_")
                    ):
                        filtered_data.append(item)

                data = filtered_data

                if not data:

                    return (
                        f"No, {current_medicine.replace('_', ' ').title()} "
                        "is not present in your current prescription."
                    )
                if len(data) == 1:

                    med = data[0]

                    return f"""
                Yes, {med['medicine_name'].replace('_', ' ').title()} is prescribed today.

                Dosage: {med['dosage']}
                Frequency: {med['frequency']}
                Timing: {med['timing']}
                Scheduled Time: {med['scheduled_time']}
                """

            save_tool(
                session_id,
                "prescription"
            )
            return (
                ToolSummaryService
                .summarize(
                    enhanced_message,
                    data,
                    "Prescription Tool"
                )
            )

        elif route == "reminder":

            data = reminder_tool(
                db,
                user_id
            )
            medicines = detect_medicines(message)

            if len(medicines) == 1:

                save_medicine(
                    session_id,
                    medicines[0]
                )

                current_medicine = get_medicine(
                    session_id
                )

                enhanced_message = f"""
            Current Medicine:
            {current_medicine}

            User Question:
            {message}
            """

            query = message.lower()

            plural_queries = [

    # General reminders
    "reminders",
    "all reminders",
    "my reminders",
    "show reminders",
    "show all reminders",
    "list reminders",
    "today reminders",
    "today's reminders",
    "reminder status",
    "reminder history",

    # Pending reminders
    "pending reminder",
    "pending reminders",
    "show pending reminders",
    "list pending reminders",
    "which reminders are pending",
    "what reminders are pending",

    # Pending medicines/doses
    "pending medicine",
    "pending medicines",
    "pending dose",
    "pending doses",
    "show pending medicines",
    "show pending doses",
    "list pending medicines",
    "list pending doses",
    "which medicines are pending",
    "which doses are pending",
    "what medicines are pending",
    "what is pending today",
    "any medicines left",
    "any pending medicines",
    "any pending doses",

    # Missed reminders
    "missed reminder",
    "missed reminders",
    "missed medicine",
    "missed medicines",
    "missed dose",
    "missed doses",
    "show missed reminders",
    "show missed medicines",
    "show missed doses",
    "list missed reminders",
    "list missed medicines",
    "list missed doses",
    "did i miss any medicines",
    "did i miss any doses",
    "have i missed any medicines",
    "have i missed any doses",
    "which medicines did i miss",
    "which doses did i miss",

    # Due / overdue
    "due medicines",
    "due doses",
    "due reminders",
    "overdue medicines",
    "overdue doses",
    "overdue reminders",
    "what medicines are due",
    "which medicines are due",
    "what reminders are due",
    "which reminders are due"
]

            is_plural = any(
                word in query
                for word in plural_queries
            )

            if current_medicine and not is_plural:

                filtered = []

                for item in data:

                    if (
                        item["medicine_name"]
                        .lower()
                        .replace(" ", "_")
                        ==
                        current_medicine.lower()
                        .replace(" ", "_")
                    ):
                        filtered.append(item)

                data = filtered
            save_tool(
    session_id,
    "reminder"
)
            return ToolSummaryService.summarize(
                enhanced_message,
                data,
                "Reminder Tool"
            )
        elif route == "json":
            print(
                "MESSAGE:",
                message
            )

            print(
                "ENHANCED:",
                enhanced_message
            )
            medicines = detect_medicines(message)

            if len(medicines) == 1:

                medicine = medicines[0]

                save_medicine(
                    session_id,
                    medicine
                )

                current_medicine = get_medicine(
                    session_id
                )

                enhanced_message = f"""
            Current Medicine:
            {current_medicine}

            User Question:
            {message}
            """

            elif len(medicines) > 1:

                medicine = None

            else:

                medicine = extract_medicine(message)
            if not medicine:

                unknown_medicine = (
                    extract_unknown_medicine(
                        message
                    )
                )

                if unknown_medicine:

                    save_medicine(
                        session_id,
                        unknown_medicine
                    )
                    current_medicine = get_medicine(
                        session_id
                    )

                    enhanced_message = f"""
                    Current Medicine:
                    {current_medicine}

                    User Question:
                    {message}
                    """
                    return AssistantService.ask_ai(
                        session_id,
                        enhanced_message
                    )

                if current_medicine:

                    medicine = current_medicine

                    enhanced_message = f"""
                Current Medicine:
                {medicine}

                User Question:
                {message}
                """
                    save_medicine(session_id, medicine)

            print("EXTRACTED:", medicine)

            # if not medicine:

            #     unknown_medicine = (
            #         extract_unknown_medicine(
            #             message
            #         )
            #     )

            #     if unknown_medicine:

            #         save_medicine(
            #             session_id,
            #             unknown_medicine
            #         )

            #         print(
            #             "SAVED UNKNOWN:",
            #             unknown_medicine
            #         )

            #     return (
            #         AssistantService
            #         .ask_ai(
            #             session_id,
            #             message
            #         )
            #     )
            # No medicine found → treat it as a normal conversation
            if not medicine:

                return AssistantService.ask_ai(
                    session_id,
                    enhanced_message
                )
            medicine_data = (

                JsonService
                .get_medicine_data(
                    medicine
                )
            )

            if not medicine_data:

                return (
                    AssistantService
                    .ask_ai(
                        session_id,
                        enhanced_message
                    )
                )
            save_tool(
    session_id,
    "json"
)
            return (

                JsonSummaryService
                .summarize(

                    enhanced_message,

                    medicine_data

                )
            )
            
        return (
            "JSON integration coming next."
        )