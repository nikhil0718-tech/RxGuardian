import os

from dotenv import load_dotenv

from groq import Groq

from app.rag.retriever import (
    retrieve
)

load_dotenv()

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)
def ask_rag(question):

    documents = retrieve(
        question
    )
    print("===================================")
    print("RETRIEVED DOCUMENTS")
    print("===================================")

    for i, doc in enumerate(documents):

        print(f"\nDocument {i+1}\n")

        print(doc)

    context = "\n\n".join(
        documents
    )


    prompt = f"""
You are a professional medicine assistant.

Retrieved Context:
{context}

User Question:
{question}

Instructions:

- Answer primarily from the retrieved context.
- If the context is incomplete, use reliable general medical knowledge only when appropriate.
- For follow-up questions (e.g., "it", "this medicine", "another dose"), use the medicine described in the retrieved context.
- If multiple medicines are present, answer using all relevant medicines in the context.
- Never invent facts.
- Never diagnose diseases.
- Never prescribe or change treatment.
- Never mention retrieved documents or information sources.
- If uncertain, reply:
  "Please consult your doctor or pharmacist for personalized medical advice."
- Keep answers concise, accurate, and patient-friendly.

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