import os

from groq import Groq

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)

class ToolSummaryService:

    @staticmethod
    def summarize(
        question,
        data,
        tool_name
    ):

        prompt = f"""
You are a medicine assistant.

Tool:
{tool_name}

User Question:
{question}

Tool Data:
{data}

Instructions:

- Answer only using the provided Tool Data.
- Never invent or assume missing information.
- Never diagnose diseases.
- Never prescribe or change medicines.
- Keep responses short, clear, and patient-friendly.
- Do not mention tools, databases, or internal systems.

Prescription Tool:

- If one medicine is returned:
  Respond with:
  Yes, <Medicine Name> is prescribed today.

  Dosage: ...
  Frequency: ...
  Timing: ...
  Scheduled Time: ...

- If multiple medicines are returned:
  List every prescribed medicine with its Dosage, Frequency, Timing, and Scheduled Time.

- If no medicine matches:
  Respond:
  The requested medicine is not present in your current prescription.

Reminder Tool:

- Answer only from reminder data.
- If multiple reminders exist, list them.
- If one reminder matches, return only that reminder.
- If nothing is pending or missed, clearly state that.

Answer:
"""


        response = (
            client.chat.completions.create(
                model=
                "llama-3.3-70b-versatile",

                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
        )

        return (
            response
            .choices[0]
            .message
            .content
        )