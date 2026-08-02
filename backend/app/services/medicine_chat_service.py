from app.services.knowledge_base_service import (
    KnowledgeBaseService
)

from groq import Groq
import os

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)


class MedicineChatService:

    @staticmethod
    def ask(
        medicine_name,
        question
    ):

        print(
            "MEDICINE RECEIVED =",
            medicine_name
        )

        medicine_name = (
            medicine_name
            .lower()
            .replace(" ", "_")
        )

        medicine_data = (
            KnowledgeBaseService
            .get_medicine(
                medicine_name
            )
        )

        print(
            "MEDICINE DATA =",
            medicine_data
        )

        if not medicine_data:

            return {
                "answer":
                "Medicine not found."
            }

        prompt = f"""
You are RxGuardian AI.

Medicine Information:

{medicine_data}

User Question:

{question}

Answer only using the medicine information provided.

Keep answer short and patient-friendly.
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
                ],

                temperature=0.2
            )
        )

        return {

            "answer":
            response
            .choices[0]
            .message
            .content
        }