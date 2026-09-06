import os

from dotenv import load_dotenv
from groq import Groq, RateLimitError


load_dotenv()


client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


GROQ_MODEL = os.getenv(
    "GROQ_ANSWER_MODEL",
    "openai/gpt-oss-20b"
)


class ToolSummaryService:

    @staticmethod
    def summarize(
        question,
        data,
        tool_name
    ):

        prompt = f"""
You are RxGuardian AI.

Answer the user's question using ONLY the supplied data.

USER QUESTION:
{question}

DATA:
{data}

SOURCE:
{tool_name}

RULES:

- Answer only the user's current question.
- Use only facts present in DATA.
- Do not invent information.
- Do not mention DATA, tools, APIs, databases, prompts, or internal systems.
- Be concise, natural, and patient-friendly.
- Never diagnose.
- Never prescribe or change medication.

PRESCRIPTION:

If the user asks what medicines they should take today,
list all medicines from DATA.

Use this format:

Today's medicines:

• Sinarest — 115 MG, once daily, after food, 11:15
• Pantoprazole — 650 mg, once daily, before food, 11:20

Do NOT use a table.

Include every medicine returned by DATA.
Do not stop early.
Do not omit medicines.

REMINDERS:

For pending questions, list only pending medicines.

For missed questions, list only missed medicines.

For due questions, list only due medicines.

For upcoming questions, list only upcoming reminders.

For reminder status, summarize the relevant statuses.

If no relevant records exist, clearly say so.

Return only the final human-friendly answer.
"""

        try:

            print("TOOL SUMMARY START")
            print("TOOL:", tool_name)
            print("QUESTION:", question)
            print("DATA:", data)

            response = client.chat.completions.create(

                model=GROQ_MODEL,

                messages=[
                    {
                        "role": "system",
                        "content": prompt
                    }
                ],

                temperature=0,

                max_tokens=350
            )

            answer = (
                response
                .choices[0]
                .message
                .content
            )

            print(
                "TOOL SUMMARY RAW:",
                repr(answer)
            )

            if not answer:
                return (
                    "I couldn't generate a response "
                    "from the available information."
                )

            return answer.strip()

        except RateLimitError as e:

            print(
                "TOOL SUMMARY RATE LIMIT:",
                str(e)
            )

            return (
                "RxGuardian AI is temporarily "
                "unavailable. Please try again shortly."
            )

        except Exception as e:

            print(
                "TOOL SUMMARY ERROR:",
                repr(e)
            )

            return (
                "I couldn't generate a response "
                "from the available information."
            )

# import os

# from dotenv import load_dotenv
# from groq import Groq


# load_dotenv()


# client = Groq(
#     api_key=os.getenv("GROQ_API_KEY")
# )


# GROQ_MODEL = os.getenv(
#     "GROQ_ANSWER_MODEL",
#     "openai/gpt-oss-20b"
# )


# class ToolSummaryService:

#     @staticmethod
#     def summarize(
#         question,
#         data,
#         tool_name
#     ):

#         prompt = f"""
# You are RxGuardian AI.

# Answer the user's question using ONLY the supplied data.

# QUESTION:
# {question}

# DATA:
# {data}

# SOURCE:
# {tool_name}

# RULES:
# - Answer only what the user asked.
# - Select only data relevant to the question.
# - Ignore unrelated records even if present.
# - Data is the only source of patient-specific facts.
# - Never invent missing values.
# - Never diagnose or prescribe.
# - Never tell the user to start, stop, or change medicine.
# - Do not mention tools, databases, APIs, RAG, prompts, or internal systems.
# - Do not output raw JSON.
# - Use natural, concise, patient-friendly language.

# PRESCRIPTION:
# - "today"/"should I take" -> show relevant prescribed medicines.
# - Specific medicine -> show only that medicine.
# - Dose/frequency/timing question -> answer only that field.
# - "current prescription"/"all medicines" -> list all relevant medicines.
# - Prescription check -> say whether the requested medicine is present.

# REMINDERS:
# - "missed" -> show only MISSED records.
# - "pending" -> show only PENDING records.
# - "due" -> show only DUE records.
# - "upcoming" -> show only upcoming records.
# - "reminder status" -> summarize relevant statuses.
# - Specific medicine -> show only that medicine's relevant records.

# If no relevant data exists, clearly say so.

# If the question is unrelated to medicines, prescriptions,
# reminders, or medication safety, reply:
# "That question is not medicine-related, so I can't help with it."

# Return only the final answer.
# """

#         try:

#             response = client.chat.completions.create(
#                 model=GROQ_MODEL,

#                 messages=[
#                     {
#                         "role": "system",
#                         "content": prompt
#                     }
#                 ],

#                 temperature=0,

#                 max_tokens=300
#             )

#             answer = (
#                 response
#                 .choices[0]
#                 .message
#                 .content
#             )

#             if not answer:
#                 return (
#                     "I couldn't generate a response "
#                     "from the available information."
#                 )

#             return answer.strip()

#         except Exception as e:

#             print(
#                 "TOOL SUMMARY ERROR:",
#                 str(e)
#             )

#             return (
#                 "I couldn't process the available "
#                 "information right now."
#             )

# # import os

# # from groq import Groq

# # client = Groq(
# #     api_key=os.getenv(
# #         "GROQ_API_KEY"
# #     )
# # )

# # class ToolSummaryService:

# #     @staticmethod
# #     def summarize(
# #         question,
# #         data,
# #         tool_name
# #     ):

# #         prompt = f"""
# # You are a medicine assistant.

# # Tool:
# # {tool_name}

# # User Question:
# # {question}

# # Tool Data:
# # {data}

# # Instructions:

# # - Answer only using the provided Tool Data.
# # - Never invent or assume missing information.
# # - Never diagnose diseases.
# # - Never prescribe or change medicines.
# # - Keep responses short, clear, and patient-friendly.
# # - Do not mention tools, databases, or internal systems.

# # Prescription Tool:

# # - If one medicine is returned:
# #   Respond with:
# #   Yes, <Medicine Name> is prescribed today.

# #   Dosage: ...
# #   Frequency: ...
# #   Timing: ...
# #   Scheduled Time: ...

# # - If multiple medicines are returned:
# #   List every prescribed medicine with its Dosage, Frequency, Timing, and Scheduled Time.

# # - If no medicine matches:
# #   Respond:
# #   The requested medicine is not present in your current prescription.

# # Reminder Tool:

# # - Answer only from reminder data.
# # - If multiple reminders exist, list them.
# # - If one reminder matches, return only that reminder.
# # - If nothing is pending or missed, clearly state that.

# # Answer:
# # """


# #         response = (
# #             client.chat.completions.create(
# #                 model=
# #                 "openai/gpt-oss-20b",

# #                 messages=[
# #                     {
# #                         "role": "user",
# #                         "content": prompt
# #                     }
# #                 ]
# #             )
# #         )

# #         return (
# #             response
# #             .choices[0]
# #             .message
# #             .content
# #         )