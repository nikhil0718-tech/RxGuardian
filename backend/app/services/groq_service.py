import os

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)


class GroqService:

    @staticmethod
    def generate_summary(
        medicine_data
    ):

        prompt = f"""
You are RxGuardian AI.

Using the medicine information below,
generate exactly 5 points.

Medicine:
{medicine_data['medicine_name']}

Information:
{medicine_data}

Return format:

1. Usage
2. Best Time To Take
3. Dosage Advice
4. Precautions
5. Common Side Effects

Simple language.
No markdown.
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

        return (
            response
            .choices[0]
            .message
            .content
        )