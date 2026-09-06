import os
import json

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)


def ask_json(
    question,
    medicine_data
):

    prompt = f"""
You are RxGuardian AI.

Answer the question using ONLY
the medicine information below.

Medicine Data:

{json.dumps(
    medicine_data,
    indent=2
)}

Question:

{question}

Answer:
"""

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