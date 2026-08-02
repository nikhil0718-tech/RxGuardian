import os

from groq import Groq

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)


def generate_response(
    user_question,
    tool_data
):

    prompt = f"""
You are RxGuardian AI.

User Question:
{user_question}

Tool Data:
{tool_data}

Convert the tool data into a natural,
patient-friendly answer.

Do not show raw JSON.

Keep the answer short and clear.
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