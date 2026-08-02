import os

from groq import Groq

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)


def llm_classify(query):

    prompt = f"""
You are an intent classifier.

Classify the user's medicine-related query into exactly one category.

Categories:

json
- General medicine information.
- Usage, side effects, dosage, best time, generic name, medicine details, explanation, follow-up questions about a medicine.

rag
- Medicine safety, precautions, warnings, storage, drug interactions, missed dose guidance, overdose, antibiotics, pregnancy safety.

prescription
- Questions requiring today's prescription.
- Which medicines to take.
- Current prescriptions.
- Whether a medicine is prescribed today.

reminder
- Reminder status.
- Pending medicines.
- Missed medicines.
- Due medicines.
- Adherence.
- Reminder history.

Rules:

- Questions about the medicine itself → json
- Questions about medicine safety or interactions → rag
- Questions about prescribed medicines → prescription
- Questions about reminders or missed doses today → reminder

Return ONLY one word:

json
rag
prescription
reminder

Query:
{query}

Category:
"""

    query_lower = query.lower()
    if "used for" in query_lower:
        return "json"

    if "what is this medicine" in query_lower:
        return "json"

    if "tell me about this medicine" in query_lower:
        return "json"

    if "side effect" in query_lower:
        return "json"

    if "dosage" in query_lower:
        return "json"

    if "precaution" in query_lower:
        return "rag"

    if "interaction" in query_lower:
        return "rag"

    if "can i take" in query_lower and "together" in query_lower:
        return "rag"

    if "forgot" in query_lower:
        return "rag"

    if "missed dose" in query_lower:
        return "rag"

    if "what should i do if i miss" in query_lower:
        return "rag"

    if "should i take it today" in query_lower:
        return "prescription"

    if "what medicines should i take today" in query_lower:
        return "prescription"

    if "current medicines" in query_lower:
        return "prescription"

    if "active medicines" in query_lower:
        return "prescription"

    if "did i miss today's dose" in query_lower:
        return "reminder"

    if "did i miss any medicines" in query_lower:
        return "reminder"

    if "pending medicines" in query_lower:
        return "reminder"

    if "pending doses" in query_lower:
        return "reminder" 
    response = (
        client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )
    )

    result = (
        response
        .choices[0]
        .message
        .content
        .strip()
        .lower()
    )

    if "json" in result:
        return "json"

    if "rag" in result:
        return "rag"

    if "prescription" in result:
        return "prescription"

    if "reminder" in result:
        return "reminder"

    return "json"