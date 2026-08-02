import os

from groq import Groq
from app.services.conversation_memory import (

    save_medicine,

    get_medicine
)

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)

class AssistantService:

    @staticmethod
    def ask_ai(
        session_id,
        message
    ):

        MEDICINES = [

            "ascoril",
            "augmentin",
            "azithromycin",
            "cetirizine",
            "combiflam",
            "crocin",
            "dolo 650",
            "pantoprazole",
            "sinarest",
            "zincovit"

        ]

        current_medicine = get_medicine(
            session_id
        )

        prompt = f"""
You are a professional medicine assistant.

Conversation Context:
Current Medicine: {current_medicine}

User Question:
{message}

Instructions:

* Answer only medicine-related questions.
* Use the Current Medicine for follow-up questions (e.g., "it", "this medicine", "its side effects", "explain it", "best time", "generic name", etc.).
* If no current medicine is available, answer using reliable general medical knowledge.
* Keep responses accurate, concise, and easy for patients to understand.
* Answer only what the user asks. Do not add unrelated information.
* Never invent facts or guess uncertain medical information.
* Never diagnose diseases.
* Never prescribe medicines.
* Never recommend starting, stopping, or changing any medicine.
* Never mention databases, knowledge bases, internal systems, AI models, or information sources.
* If the information is uncertain, reply:
  "Please consult your doctor or pharmacist for personalized medical advice."

Formatting:

* Match the user's requested format (paragraph, bullets, numbered list, summary, etc.).
* If the user requests complete details, include:
  • Medicine Name
  • Generic Name (if known)
  • Uses
  • Best Time to Take
  • Dosage Information
  • Precautions
  • Common Side Effects
  • Storage Guidance (if known)
  • Helpful Tips
  • When to Consult a Doctor

Answer:
"""


        response = client.chat.completions.create(

            model=
            "llama-3.3-70b-versatile",

            messages=[
                {
                    "role":
                    "user",

                    "content":
                    prompt
                }
            ]
        )

        return (

            response
            .choices[0]
            .message
            .content
        )