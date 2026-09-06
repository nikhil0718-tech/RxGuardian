import os

from groq import Groq, RateLimitError

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)


class JsonSummaryService:

    @staticmethod
    def summarize(
        question,
        medicine_data
    ):

        prompt = f"""
You are a medicine assistant.

Medicine Information:
{medicine_data}

User Question:
{question}

Instructions:

- Answer using the provided medicine information.
- For follow-up questions, use the medicine information above.
- If requested information is unavailable, use reliable general medical knowledge only when appropriate.
- Do not invent facts or dosage values.
- Keep responses accurate, concise, and patient-friendly.
- Answer only what the user asks.
- Do not add unrelated information.
- Never diagnose diseases.
- Never prescribe medicines.
- Never recommend starting, stopping, or changing medicines.
- Never mention JSON, databases, internal systems, or information sources.
- If uncertain, reply:
  "Please consult your doctor or pharmacist for personalized medical advice."

Formatting:

- Match the user's requested format (paragraph, bullets, numbered list, summary, etc.).
- If complete details are requested, include:
  • Medicine Name
  • Generic Name
  • Uses
  • Best Time
  • Dosage
  • Precautions
  • Side Effects
  • Storage (if available)
  • Helpful Tips
  • When to Consult a Doctor

Answer:
"""

        try:
            response = (

                client.chat.completions.create(

                    model=
                    "openai/gpt-oss-20b",

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
        except RateLimitError:
            return {
        "answer": (
            "AI service is temporarily unavailable "
            "because the daily token limit has been reached. "
            "Please try again later."
        )
    }