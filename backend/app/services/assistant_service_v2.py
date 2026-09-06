from app.services.llm_router import (
    llm_classify
)

from app.rag.rag_service import (
    ask_rag
)

from app.tools.prescription_tool import (
    execute as prescription_tool
)

from app.tools.reminder_tool import (
    execute as reminder_tool
)

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
    extract_unknown_medicine
)

from app.services.medicine_detector import (
    detect_medicines
)

from app.services.conversation_memory import (
    get_medicine,
    save_medicine,
    save_route,
    save_tool
)


class AssistantServiceV2:

    @staticmethod
    def ask_ai(
        session_id,
        message,
        user_id,
        db
    ):

        # ============================================================
        # LOCAL BASIC MESSAGE HANDLING
        # ============================================================

        message_clean = message.strip().lower()

        greetings = {
            "hi",
            "hello",
            "hey",
            "hii",
            "hiii",
            "good morning",
            "good afternoon",
            "good evening"
        }

        if message_clean in greetings:

            return (
                "Hello! 👋 I'm RxGuardian AI. "
                "You can ask me about medicines, "
                "prescriptions, reminders, or medication safety."
            )

        # ============================================================
        # CURRENT MEDICINE
        # ============================================================

        current_medicine = get_medicine(
            session_id
        )

        print(
            "CURRENT MEDICINE:",
            current_medicine
        )

        # Keep original user message unchanged
        enhanced_message = message

        # ============================================================
        # LLM SEMANTIC ROUTING
        # ============================================================

        route_data = llm_classify(
            message
        )

        # ------------------------------------------------------------
        # New router returns:
        #
        # MEDICINE_INFO
        # MEDICINE_SAFETY
        # MEDICINE_INTERACTION
        # MISSED_DOSE_GUIDANCE
        # TODAY_PRESCRIPTION
        # CURRENT_PRESCRIPTION
        # PRESCRIPTION_CHECK
        # PENDING_MEDICINES
        # MISSED_MEDICINES
        # DUE_MEDICINES
        # UPCOMING_REMINDERS
        # REMINDER_STATUS
        # ADHERENCE
        # ------------------------------------------------------------

        llm_intent = route_data.get(
            "intent"
        )

        # ============================================================
        # ROUTER FAILURE
        # Do not call another Groq model when the router fails.
        # ============================================================

        if llm_intent == "ROUTER_ERROR":

            print(
                "ROUTER ERROR - skipping all LLM calls"
            )

            return (
                "RxGuardian AI is temporarily unavailable. "
                "Please try again shortly."
            )

        medicine_name = route_data.get(
            "medicine_name"
        )

        medicine_names = route_data.get(
            "medicine_names",
            []
        )

        print(
            "LLM INTENT:",
            llm_intent
        )

        print(
            "LLM MEDICINE:",
            medicine_name
        )

        print(
            "LLM MEDICINES:",
            medicine_names
        )

        # ============================================================
        # NEW LLM INTENT → EXISTING INTERNAL ROUTE
        # ============================================================

        ROUTE_MAP = {

            # --------------------------------------------------------
            # Medicine information
            # Existing JSON medicine-information pipeline
            # --------------------------------------------------------

            "MEDICINE_INFO":
                "json",

            # --------------------------------------------------------
            # Medical safety / knowledge
            # Existing RAG pipeline
            # --------------------------------------------------------

            "MEDICINE_SAFETY":
                "rag",

            "MEDICINE_INTERACTION":
                "rag",

            "MISSED_DOSE_GUIDANCE":
                "rag",

            # --------------------------------------------------------
            # Prescription
            # Existing prescription pipeline
            # --------------------------------------------------------

            "TODAY_PRESCRIPTION":
                "prescription",

            "CURRENT_PRESCRIPTION":
                "prescription",

            "PRESCRIPTION_CHECK":
                "prescription",

            # --------------------------------------------------------
            # Reminder / medication status
            # Existing reminder pipeline
            # --------------------------------------------------------

            "PENDING_MEDICINES":
                "reminder",

            "MISSED_MEDICINES":
                "reminder",

            "DUE_MEDICINES":
                "reminder",

            "UPCOMING_REMINDERS":
                "reminder",

            "REMINDER_STATUS":
                "reminder",

            "ADHERENCE":
                "reminder"
        }

        # Convert new semantic intent into the internal
        # route expected by the existing code below.

        route = ROUTE_MAP.get(
            llm_intent,
            llm_intent
        )

        print(
            "LLM ROUTE:",
            llm_intent
        )

        print(
            "INTERNAL ROUTE:",
            route
        )

        # ============================================================
        # SAVE ROUTE
        # ============================================================

        save_route(
            session_id,
            route
        )

        # ============================================================
        # RAG ROUTES
        # ============================================================

        if route == "rag":

            print(
                "MESSAGE:",
                message
            )

            print(
                "ENHANCED:",
                enhanced_message
            )

            # --------------------------------------------------------
            # Detect medicines explicitly present in the query
            # --------------------------------------------------------

            medicines = detect_medicines(
                message
            )

            print(
                "DETECTED MEDICINES:",
                medicines
            )

            print(
                "CURRENT MEDICINE:",
                current_medicine
            )

            # --------------------------------------------------------
            # One medicine detected
            # --------------------------------------------------------

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

            # --------------------------------------------------------
            # Multiple medicines
            # --------------------------------------------------------

            elif len(medicines) > 1:

                print(
                    "MULTIPLE MEDICINES DETECTED:",
                    medicines
                )

                # Do not overwrite current medicine
                medicine = None

                enhanced_message = message

            # --------------------------------------------------------
            # No medicine detected
            # --------------------------------------------------------

            else:

                medicine = extract_medicine(
                    message
                )

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

            # --------------------------------------------------------
            # Save tool
            # --------------------------------------------------------

            save_tool(
                session_id,
                "rag"
            )

            # --------------------------------------------------------
            # RAG response
            # --------------------------------------------------------

            return ask_rag(
                enhanced_message
            )

        # ============================================================
        # PRESCRIPTION ROUTES
        # ============================================================

        elif route == "prescription":

            data = prescription_tool(
                db,
                user_id
            )

            print("================================")
            print("PRESCRIPTION TOOL DATA:")
            print(data)
            print("PRESCRIPTION DATA TYPE:")
            print(type(data))
            print("================================")

            print(
                "PRESCRIPTION INTENT:",
                llm_intent
            )

            print(
                "PRESCRIPTION MEDICINE:",
                medicine_name
            )


            # ============================================================
            # FILTER SPECIFIC MEDICINE
            # ============================================================

            if medicine_name:

                target = (
                    medicine_name
                    .strip()
                    .lower()
                    .replace(" ", "")
                    .replace("-", "")
                    .replace("_", "")
                )

                filtered_data = []

                for item in data:

                    if not isinstance(item, dict):
                        continue

                    item_name = str(
                        item.get(
                            "medicine_name",
                            ""
                        )
                    )

                    normalized_name = (
                        item_name
                        .strip()
                        .lower()
                        .replace(" ", "")
                        .replace("-", "")
                        .replace("_", "")
                    )

                    if normalized_name == target:

                        filtered_data.append(item)

                data = filtered_data


            # ============================================================
            # TODAY / CURRENT PRESCRIPTION
            # ============================================================

            if llm_intent in {
                "TODAY_PRESCRIPTION",
                "CURRENT_PRESCRIPTION"
            }:

                # No medicine was specified.
                # Keep the complete prescription.

                if not data:

                    return (
                        "There are no medicines available "
                        "in your current prescription."
                    )


            # ============================================================
            # PRESCRIPTION CHECK
            # ============================================================

            elif llm_intent == "PRESCRIPTION_CHECK":

                if not data:

                    return (
                        f"No, {medicine_name} is not present "
                        "in your current prescription."
                    )


            # ============================================================
            # DEBUG
            # ============================================================

            print(
                "FILTERED PRESCRIPTION DATA:",
                data
            )
            print("CALLING TOOL SUMMARY SERVICE")

            try:

                answer = ToolSummaryService.summarize(
                    question=message,
                    data=data,
                    tool_name="Prescription Tool"
                )

                print("TOOL SUMMARY RESULT:", repr(answer))

                if not answer:
                    print("TOOL SUMMARY RETURNED EMPTY")

                    return (
                        "I couldn't generate a response "
                        "from the available prescription information."
                    )

                return answer

            except Exception as e:

                print(
                    "PRESCRIPTION SUMMARY ERROR:",
                    repr(e)
                )

                return (
                    "I couldn't generate a response "
                    "from the available prescription information."
                )

            print(
                "FILTERED DATA TYPE:",
                type(data)
            )


            # ============================================================
            # HUMANIZED RESPONSE
            # ============================================================

            return ToolSummaryService.summarize(
                question=message,
                data=data,
                tool_name="Prescription Tool",
                intent=llm_intent
            )
        # ============================================================
        # REMINDER ROUTES
        # ============================================================

        elif route == "reminder":

            data = reminder_tool(
                db,
                user_id
            )

            print(
                "REMINDER INTENT:",
                llm_intent
            )

            print(
                "REMINDER MEDICINE:",
                medicine_name
            )

            # --------------------------------------------------------
            # Normalize data
            # --------------------------------------------------------

            if data is None:
                data = []

            if isinstance(data, dict):
                data = [data]

            # --------------------------------------------------------
            # Normalize status
            # --------------------------------------------------------

            def get_status(item):

                if not isinstance(item, dict):
                    return ""

                status = item.get(
                    "status",
                    ""
                )

                return str(
                    status
                ).strip().lower()

            # --------------------------------------------------------
            # Normalize medicine name
            # --------------------------------------------------------

            def get_medicine_name(item):

                if not isinstance(item, dict):
                    return ""

                return str(
                    item.get(
                        "medicine_name",
                        ""
                    )
                ).strip()

            # --------------------------------------------------------
            # Filter according to semantic intent
            # --------------------------------------------------------

            if llm_intent == "PENDING_MEDICINES":

                data = [
                    item
                    for item in data
                    if get_status(item) == "pending"
                ]

            elif llm_intent == "MISSED_MEDICINES":

                data = [
                    item
                    for item in data
                    if get_status(item) == "missed"
                ]

            elif llm_intent == "DUE_MEDICINES":

                data = [
                    item
                    for item in data
                    if get_status(item) in {
                        "due",
                        "overdue"
                    }
                ]

            elif llm_intent == "UPCOMING_REMINDERS":

                data = [
                    item
                    for item in data
                    if get_status(item) in {
                        "upcoming",
                        "scheduled",
                        "pending"
                    }
                ]

            # --------------------------------------------------------
            # Specific medicine filtering
            # --------------------------------------------------------

            if medicine_name:

                target = (
                    medicine_name
                    .strip()
                    .lower()
                    .replace(" ", "")
                    .replace("_", "")
                    .replace("-", "")
                )

                filtered_data = []

                for item in data:

                    item_name = (
                        get_medicine_name(item)
                    )

                    normalized_item = (
                        item_name
                        .lower()
                        .replace(" ", "")
                        .replace("_", "")
                        .replace("-", "")
                    )

                    if normalized_item == target:

                        filtered_data.append(item)

                data = filtered_data

            # --------------------------------------------------------
            # Save tool
            # --------------------------------------------------------

            save_tool(
                session_id,
                "reminder"
            )

            # --------------------------------------------------------
            # Generate final answer
            # --------------------------------------------------------

                        # --------------------------------------------------------
            # Deterministic reminder response
            # --------------------------------------------------------

            if not data:

                if llm_intent == "PENDING_MEDICINES":
                    return "You don't have any pending medicines right now."

                elif llm_intent == "MISSED_MEDICINES":
                    return "You haven't missed any medicines."

                elif llm_intent == "DUE_MEDICINES":
                    return "You don't have any medicines due right now."

                elif llm_intent == "UPCOMING_REMINDERS":
                    return "You don't have any upcoming reminders."

                elif llm_intent == "REMINDER_STATUS":
                    return "You don't have any active reminders."

                elif llm_intent == "ADHERENCE":
                    return "No adherence information is currently available."


            # --------------------------------------------------------
            # PENDING MEDICINES
            # --------------------------------------------------------

            if llm_intent == "PENDING_MEDICINES":

                medicines = {}

                for item in data:

                    name = get_medicine_name(item)
                    time = item.get("scheduled_time", "")

                    if name:
                        medicines.setdefault(
                            name,
                            []
                        ).append(time)

                lines = []

                for medicine, times in medicines.items():

                    unique_times = list(
                        dict.fromkeys(times)
                    )

                    if unique_times:

                        lines.append(
                            f"• {medicine.title()} — "
                            f"{', '.join(unique_times)}"
                        )

                    else:

                        lines.append(
                            f"• {medicine.title()}"
                        )

                return (
                    "You have these medicines pending:\n\n"
                    + "\n".join(lines)
                )


            # --------------------------------------------------------
            # MISSED MEDICINES
            # --------------------------------------------------------

            if llm_intent == "MISSED_MEDICINES":

                medicines = {}

                for item in data:

                    name = get_medicine_name(item)
                    time = item.get("scheduled_time", "")

                    if name:
                        medicines.setdefault(
                            name,
                            []
                        ).append(time)

                lines = []

                for medicine, times in medicines.items():

                    unique_times = list(
                        dict.fromkeys(times)
                    )

                    if unique_times:

                        lines.append(
                            f"• {medicine.title()} — "
                            f"{', '.join(unique_times)}"
                        )

                    else:

                        lines.append(
                            f"• {medicine.title()}"
                        )

                return (
                    "You missed these medicines:\n\n"
                    + "\n".join(lines)
                )


            # --------------------------------------------------------
            # DUE MEDICINES
            # --------------------------------------------------------

            if llm_intent == "DUE_MEDICINES":

                medicines = {}

                for item in data:

                    name = get_medicine_name(item)
                    time = item.get("scheduled_time", "")

                    if name:
                        medicines.setdefault(
                            name,
                            []
                        ).append(time)

                lines = []

                for medicine, times in medicines.items():

                    unique_times = list(
                        dict.fromkeys(times)
                    )

                    lines.append(
                        f"• {medicine.title()} — "
                        f"{', '.join(unique_times)}"
                    )

                return (
                    "These medicines are due now:\n\n"
                    + "\n".join(lines)
                )


            # --------------------------------------------------------
            # UPCOMING REMINDERS
            # --------------------------------------------------------

            if llm_intent == "UPCOMING_REMINDERS":

                grouped = {}

                for item in data:

                    name = get_medicine_name(item)
                    time = item.get("scheduled_time", "")

                    if not name:
                        continue

                    # Clean medicine name
                    display_name = (
                        name.replace("_", " ")
                            .strip()
                            .title()
                    )

                    # Group by medicine
                    grouped.setdefault(
                        display_name,
                        []
                    ).append(time)

                lines = []

                for medicine, times in grouped.items():

                    # Remove duplicate times
                    unique_times = list(
                        dict.fromkeys(
                            time for time in times
                            if time
                        )
                    )

                    if unique_times:

                        lines.append(
                            f"• {medicine} — "
                            f"{', '.join(unique_times)}"
                        )

                    else:

                        lines.append(
                            f"• {medicine}"
                        )

                if not lines:
                    return "You don't have any upcoming reminders."

                return (
                    "Your upcoming reminders are:\n\n"
                    + "\n".join(lines)
                )
            # --------------------------------------------------------
            # REMINDER STATUS
            # --------------------------------------------------------

            if llm_intent == "REMINDER_STATUS":

                counts = {
                    "pending": 0,
                    "missed": 0,
                    "taken": 0,
                    "due": 0
                }

                for item in data:

                    status = get_status(item)

                    if status in counts:
                        counts[status] += 1

                return (
                    "Here's your reminder status:\n\n"
                    f"• Pending: {counts['pending']}\n"
                    f"• Missed: {counts['missed']}\n"
                    f"• Taken: {counts['taken']}\n"
                    f"• Due: {counts['due']}"
                )
        # ============================================================
        # JSON / MEDICINE INFORMATION
        # ============================================================

        elif route == "json":

            print(
                "MESSAGE:",
                message
            )

            print(
                "ENHANCED:",
                enhanced_message
            )

            # --------------------------------------------------------
            # Detect known medicine
            # --------------------------------------------------------

            medicines = detect_medicines(
                message
            )

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

                medicine = extract_medicine(
                    message
                )

            # --------------------------------------------------------
            # If no medicine was found, try unknown medicine
            # extraction.
            # --------------------------------------------------------

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

                # ----------------------------------------------------
                # Use conversation memory for follow-up questions.
                # ----------------------------------------------------

                if current_medicine:

                    medicine = current_medicine

                    enhanced_message = f"""
Current Medicine:
{medicine}

User Question:
{message}
"""

                    save_medicine(
                        session_id,
                        medicine
                    )

            print(
                "EXTRACTED:",
                medicine
            )

            # --------------------------------------------------------
            # No medicine → normal assistant conversation
            # --------------------------------------------------------

            if not medicine:

                return AssistantService.ask_ai(
                    session_id,
                    enhanced_message
                )

            # --------------------------------------------------------
            # Get medicine knowledge
            # --------------------------------------------------------

            medicine_data = (
                JsonService
                .get_medicine_data(
                    medicine
                )
            )

            # --------------------------------------------------------
            # No structured medicine data
            # → general assistant
            # --------------------------------------------------------

            if not medicine_data:

                return AssistantService.ask_ai(
                    session_id,
                    enhanced_message
                )

            # --------------------------------------------------------
            # Save tool
            # --------------------------------------------------------

            save_tool(
                session_id,
                "json"
            )

            # --------------------------------------------------------
            # Generate medicine-information answer
            # --------------------------------------------------------

            return (
                JsonSummaryService
                .summarize(
                    enhanced_message,
                    medicine_data
                )
            )

        # ============================================================
        # FALLBACK
        # ============================================================

        print(
            "UNHANDLED ROUTE:",
            repr(route)
        )

        print(
            "ORIGINAL LLM INTENT:",
            repr(llm_intent)
        )

        return (
            "I couldn't understand your request. "
            "Please ask about your medicines, "
            "prescription, reminders, or medication safety."
        )


# # from app.services.query_router import classify_query
# from app.services.llm_router import llm_classify

# from app.rag.rag_service import ask_rag

# from app.tools.prescription_tool import execute as prescription_tool

# from app.tools.reminder_tool import execute as reminder_tool

# from app.services.json_service import (
#     JsonService
# )

# from app.services.medicine_extractor import (
#     extract_medicine
# )

# from app.services.json_summary_service import (
#     JsonSummaryService
# )

# from app.services.tool_summary_service import (
#     ToolSummaryService
# )
# from app.services.assistant_service import (
#     AssistantService
# )

# from app.services.general_medicine_extractor import (
#     extract_unknown_medicine   )
# from app.services.medicine_detector import (
#     detect_medicines
# )
# from app.services.conversation_memory import (
#     get_medicine,
#     save_medicine,
#     save_route,
#     save_tool
# )
# # from app.services.conversation_memory import (
# #     get_tool
# # )

# class AssistantServiceV2:

#     @staticmethod
#     def ask_ai(
#         session_id,
#         message,
#         user_id,
#         db
#     ):
#         current_medicine = get_medicine(
#     session_id
# )
#         print(
#             "CURRENT MEDICINE:",
#             current_medicine
#         )

#         # Current question remains untouched.
#         enhanced_message = message

# # ============================================================
# # LLM SEMANTIC ROUTING
# # ============================================================

#         route_data = llm_classify(message)

#         route = route_data.get("intent")
#         medicine_name = route_data.get("medicine_name")

#         print("LLM INTENT:", route)
#         print("LLM MEDICINE:", medicine_name)

#         # ============================================================
#         # LLM INTENT -> EXISTING INTERNAL ROUTE
#         # ============================================================

#         ROUTE_MAP = {
#             "MEDICINE_INFO": "json",
#             "MEDICINE_SAFETY": "rag",
#             "MEDICINE_INTERACTION": "rag",
#             "MISSED_DOSE_GUIDANCE": "rag",
#             "TODAY_PRESCRIPTION": "prescription",
#             "CURRENT_PRESCRIPTION": "prescription",
#             "PRESCRIPTION_CHECK": "prescription",
#             "PENDING_MEDICINES": "reminder",
#             "MISSED_MEDICINES": "reminder",
#             "DUE_MEDICINES": "reminder",
#             "UPCOMING_REMINDERS": "reminder",
#             "REMINDER_STATUS": "reminder",
#             "ADHERENCE": "reminder"
#         }

#         original_route = route

#         route = ROUTE_MAP.get(
#             route,
#             route
#         )

#         print(
#             "LLM INTENT:",
#             original_route
#         )

#         print(
#             "INTERNAL ROUTE:",
#             route
#         )

#         save_route(
#             session_id,
#             route
#         )

#         print(
#             "LLM ROUTE:",
#             route
#         )
        
#         # routing_message = message

#         # if current_medicine:

#         #     enhanced_message = f"""
#         # Current Medicine:
#         # {current_medicine}

#         # User Question:
#         # {message}
#         # """
#         # else:
#         #     enhanced_message = message

#         # route = classify_query(
#         #     routing_message
#         # )
#         # last_tool = get_tool(session_id)

#         # followup_keywords = [

#         #     "time",
#         #     "timing",
#         #     "dosage",
#         #     "frequency",
#         #     "before food",
#         #     "after food",
#         #     "before meal",
#         #     "after meal",
#         #     "take it",
#         #     "take this",
#         #     "take this medicine",
#         #     "when should i take",
#         #     "when to take",
#         #     "should i take it",
#         #     "should i take this",
#         #     "schedule",
#         #     "scheduled time"
#         # ]

#         # is_followup = any(
#         #     word in message.lower()
#         #     for word in followup_keywords
#         # )

#         # if is_followup and last_tool in [
#         #     "prescription",
#         #     "reminder"
#         # ]:
#         #     print(
#         #         "FOLLOW-UP DETECTED →",
#         #         last_tool
#         #     )

#         #     route = last_tool
#         # save_route(
#         #     session_id,
#         #     route
#         # )

#         # print(
#         #     "ROUTE:",
#         #     route
#         # )
        
#         if route == "rag":
#             print(
#                 "MESSAGE:",
#                 message
#             )

#             print(
#                 "ENHANCED:",
#                 enhanced_message
#             )
#             medicines = detect_medicines(message)
#             print("DETECTED MEDICINES:", medicines)
#             print("CURRENT MEDICINE:", current_medicine)

#             if len(medicines) == 1:

#                 medicine = medicines[0]

#                 save_medicine(
#                     session_id,
#                     medicine
#                 )

#                 current_medicine = get_medicine(
#                     session_id
#                 )

#                 enhanced_message = f"""
#             Current Medicine:
#             {current_medicine}

#             User Question:
#             {message}
#             """

#             elif len(medicines) > 1:

#                 print(
#                     "MULTIPLE MEDICINES DETECTED:",
#                     medicines
#                 )

#                 medicine = None

#                 # Do NOT update conversation memory

#             else:

#                 medicine = extract_medicine(message)

#                 if not medicine:

#                     medicine = current_medicine

#                 if medicine:

#                     save_medicine(
#                         session_id,
#                         medicine
#                     )
#                     current_medicine = get_medicine(
#                         session_id
#                     )

#                     enhanced_message = f"""
#                     Current Medicine:
#                     {current_medicine}

#                     User Question:
#                     {message}
#                     """
#             save_tool(
#                 session_id,
#                 "rag"
#             )

#             return ask_rag(
#                 enhanced_message
# )

#         elif route in {
#             "TODAY_PRESCRIPTION",
#             "CURRENT_PRESCRIPTION",
#             "PRESCRIPTION_CHECK"
#         }:

#             data = prescription_tool(
#                 db,
#                 user_id
#             )

#             print(
#                 "PRESCRIPTION INTENT:",
#                 route
#             )

#             print(
#                 "PRESCRIPTION MEDICINE:",
#                 medicine_name
#             )

#             # --------------------------------------------------------
#             # Filter only when LLM explicitly identified a medicine.
#             # --------------------------------------------------------

#             if medicine_name:

#                 target = (
#                     medicine_name
#                     .lower()
#                     .replace(" ", "_")
#                 )

#                 filtered_data = []

#                 for item in data:

#                     item_name = (
#                         item
#                         .get("medicine_name", "")
#                         .lower()
#                         .replace(" ", "_")
#                     )

#                     if item_name == target:

#                         filtered_data.append(item)

#                 data = filtered_data

#             # --------------------------------------------------------
#             # Save tool
#             # --------------------------------------------------------

#             save_tool(
#                 session_id,
#                 "prescription"
#             )

#             # --------------------------------------------------------
#             # Generate final answer
#             # --------------------------------------------------------

#             return ToolSummaryService.summarize(
#                 message,
#                 data,
#                 "Prescription Tool"
#             )
#         elif route == "reminder":

#             data = reminder_tool(
#                 db,
#                 user_id
#             )
#             medicines = detect_medicines(message)

#             if len(medicines) == 1:

#                 save_medicine(
#                     session_id,
#                     medicines[0]
#                 )

#                 current_medicine = get_medicine(
#                     session_id
#                 )

#                 enhanced_message = f"""
#             Current Medicine:
#             {current_medicine}

#             User Question:
#             {message}
#             """

#             query = message.lower()

#             plural_queries = [

#     # General reminders
#     "reminders",
#     "all reminders",
#     "my reminders",
#     "show reminders",
#     "show all reminders",
#     "list reminders",
#     "today reminders",
#     "today's reminders",
#     "reminder status",
#     "reminder history",

#     # Pending reminders
#     "pending reminder",
#     "pending reminders",
#     "show pending reminders",
#     "list pending reminders",
#     "which reminders are pending",
#     "what reminders are pending",

#     # Pending medicines/doses
#     "pending medicine",
#     "pending medicines",
#     "pending dose",
#     "pending doses",
#     "show pending medicines",
#     "show pending doses",
#     "list pending medicines",
#     "list pending doses",
#     "which medicines are pending",
#     "which doses are pending",
#     "what medicines are pending",
#     "what is pending today",
#     "any medicines left",
#     "any pending medicines",
#     "any pending doses",

#     # Missed reminders
#     "missed reminder",
#     "missed reminders",
#     "missed medicine",
#     "missed medicines",
#     "missed dose",
#     "missed doses",
#     "show missed reminders",
#     "show missed medicines",
#     "show missed doses",
#     "list missed reminders",
#     "list missed medicines",
#     "list missed doses",
#     "did i miss any medicines",
#     "did i miss any doses",
#     "have i missed any medicines",
#     "have i missed any doses",
#     "which medicines did i miss",
#     "which doses did i miss",

#     # Due / overdue
#     "due medicines",
#     "due doses",
#     "due reminders",
#     "overdue medicines",
#     "overdue doses",
#     "overdue reminders",
#     "what medicines are due",
#     "which medicines are due",
#     "what reminders are due",
#     "which reminders are due"
# ]

#             is_plural = any(
#                 word in query
#                 for word in plural_queries
#             )

#             if current_medicine and not is_plural:

#                 filtered = []

#                 for item in data:

#                     if (
#                         item["medicine_name"]
#                         .lower()
#                         .replace(" ", "_")
#                         ==
#                         current_medicine.lower()
#                         .replace(" ", "_")
#                     ):
#                         filtered.append(item)

#                 data = filtered
#             save_tool(
#     session_id,
#     "reminder"
# )
#             return ToolSummaryService.summarize(
#                 message,
#                 data,
#                 "Reminder Tool"
#             )
#         elif route == "json":
#             print(
#                 "MESSAGE:",
#                 message
#             )

#             print(
#                 "ENHANCED:",
#                 enhanced_message
#             )
#             medicines = detect_medicines(message)

#             if len(medicines) == 1:

#                 medicine = medicines[0]

#                 save_medicine(
#                     session_id,
#                     medicine
#                 )

#                 current_medicine = get_medicine(
#                     session_id
#                 )

#                 enhanced_message = f"""
#             Current Medicine:
#             {current_medicine}

#             User Question:
#             {message}
#             """

#             elif len(medicines) > 1:

#                 medicine = None

#             else:

#                 medicine = extract_medicine(message)
#             if not medicine:

#                 unknown_medicine = (
#                     extract_unknown_medicine(
#                         message
#                     )
#                 )

#                 if unknown_medicine:

#                     save_medicine(
#                         session_id,
#                         unknown_medicine
#                     )
#                     current_medicine = get_medicine(
#                         session_id
#                     )

#                     enhanced_message = f"""
#                     Current Medicine:
#                     {current_medicine}

#                     User Question:
#                     {message}
#                     """
#                     return AssistantService.ask_ai(
#                         session_id,
#                         enhanced_message
#                     )

#                 if current_medicine:

#                     medicine = current_medicine

#                     enhanced_message = f"""
#                 Current Medicine:
#                 {medicine}

#                 User Question:
#                 {message}
#                 """
#                     save_medicine(session_id, medicine)

#             print("EXTRACTED:", medicine)

#             # if not medicine:

#             #     unknown_medicine = (
#             #         extract_unknown_medicine(
#             #             message
#             #         )
#             #     )

#             #     if unknown_medicine:

#             #         save_medicine(
#             #             session_id,
#             #             unknown_medicine
#             #         )

#             #         print(
#             #             "SAVED UNKNOWN:",
#             #             unknown_medicine
#             #         )

#             #     return (
#             #         AssistantService
#             #         .ask_ai(
#             #             session_id,
#             #             message
#             #         )
#             #     )
#             # No medicine found → treat it as a normal conversation
#             if not medicine:

#                 return AssistantService.ask_ai(
#                     session_id,
#                     enhanced_message
#                 )
#             medicine_data = (

#                 JsonService
#                 .get_medicine_data(
#                     medicine
#                 )
#             )

#             if not medicine_data:

#                 return (
#                     AssistantService
#                     .ask_ai(
#                         session_id,
#                         enhanced_message
#                     )
#                 )
#             save_tool(
#     session_id,
#     "json"
# )
#             return (

#                 JsonSummaryService
#                 .summarize(

#                     enhanced_message,

#                     medicine_data

#                 )
#             )
            
#         print(
#     "UNHANDLED ROUTE:",
#     repr(route)
# )

#         return (
#             f"Unhandled route: {route}"
#         )