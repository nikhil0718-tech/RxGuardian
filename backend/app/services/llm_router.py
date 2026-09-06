import os
import json

from dotenv import load_dotenv
from groq import Groq


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GROQ_MODEL = os.getenv(
    "GROQ_ROUTER_MODEL",
    "openai/gpt-oss-20b"
)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# ============================================================
# TOKEN-EFFICIENT ROUTER PROMPT
# ============================================================

SYSTEM_PROMPT = """
You are RxGuardian's semantic intent router.
Classify the CURRENT query. Do not answer.

INTENTS:
MEDICINE_INFO: general medicine info, uses, dosage, timing,
generic name, composition, side effects, explanation.
MEDICINE_SAFETY: precautions, warnings, contraindications,
overdose, pregnancy, breastfeeding, storage.
MEDICINE_INTERACTION: whether medicines interact or can be
taken together.
MISSED_DOSE_GUIDANCE: what to do after missing a dose.
TODAY_PRESCRIPTION: what medicine(s) to take today according
to the prescription, including today's dose of a named medicine.
CURRENT_PRESCRIPTION: current/active or doctor's prescription.
PRESCRIPTION_CHECK: whether a named medicine is prescribed.
PENDING_MEDICINES: pending medicines/doses.
MISSED_MEDICINES: missed medicines/doses.
DUE_MEDICINES: medicines/doses due now.
UPCOMING_REMINDERS: upcoming reminders.
REMINDER_STATUS: reminder status.
ADHERENCE: medication adherence/score.

RULES:
Classify by meaning, not keywords.
General dosage or side effects → MEDICINE_INFO.
Today's dose or what to take today → TODAY_PRESCRIPTION.
Safety → MEDICINE_SAFETY.
Medicine + medicine → MEDICINE_INTERACTION.
Action after missing → MISSED_DOSE_GUIDANCE.
Which medicines were missed → MISSED_MEDICINES.
Current prescription → CURRENT_PRESCRIPTION.
Specific prescription check → PRESCRIPTION_CHECK.
Pending/due/upcoming/status → matching reminder intent.
Adherence → ADHERENCE.

Extract only explicitly named medicines.
Never infer medicines.
One medicine → medicine_name.
Multiple → medicine_names.
None → null and [].

Return ONLY this JSON structure:
{"intent":"MEDICINE_INFO","medicine_name":null,"medicine_names":[]}
"""


# ============================================================
# ALLOWED INTENTS
# ============================================================

ALLOWED_INTENTS = {
    "MEDICINE_INFO",
    "MEDICINE_SAFETY",
    "MEDICINE_INTERACTION",
    "MISSED_DOSE_GUIDANCE",
    "TODAY_PRESCRIPTION",
    "CURRENT_PRESCRIPTION",
    "PRESCRIPTION_CHECK",
    "PENDING_MEDICINES",
    "MISSED_MEDICINES",
    "DUE_MEDICINES",
    "UPCOMING_REMINDERS",
    "REMINDER_STATUS",
    "ADHERENCE",
}


# ============================================================
# DEFAULT RESULT
# ============================================================

def default_result():
    return {
        "intent": "MEDICINE_INFO",
        "medicine_name": None,
        "medicine_names": [],
    }


# ============================================================
# NORMALIZATION
# ============================================================

def normalize_medicine_name(value):

    if value is None:
        return None

    value = str(value).strip()

    return value if value else None


def normalize_medicine_names(values):

    if not isinstance(values, list):
        return []

    result = []

    for value in values:

        value = normalize_medicine_name(value)

        if value and value not in result:
            result.append(value)

    return result


# ============================================================
# LLM ROUTER
# ============================================================

def llm_classify(query: str) -> dict:

    if not query or not query.strip():
        return default_result()

    query = query.strip()

    try:

        response = client.chat.completions.create(

            model=GROQ_MODEL,

            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": query,
                },
            ],

            temperature=0,

            # IMPORTANT:
            # GPT-OSS is a reasoning model.
            # 64 can be too small to finish JSON generation.
            max_completion_tokens=256,

            # JSON mode
            response_format={
                "type": "json_object"
            },

            # Do not return reasoning in the response.
            include_reasoning=False,
        )

        content = (
            response
            .choices[0]
            .message
            .content
        )

        print()
        print("=" * 30)
        print("LLM ROUTER")
        print("=" * 30)
        print("QUERY:", query)
        print("MODEL:", GROQ_MODEL)
        print("RAW CONTENT:", repr(content))
        print("=" * 30)

        if not content:

            print(
                "WARNING: Empty LLM response"
            )

            return default_result()

        # ----------------------------------------------------
        # PARSE JSON
        # ----------------------------------------------------

        data = json.loads(content)

        if not isinstance(data, dict):

            print(
                "WARNING: Invalid JSON object"
            )

            return default_result()

        # ----------------------------------------------------
        # INTENT
        # ----------------------------------------------------

        intent = data.get(
            "intent",
            ""
        )

        intent = (
            str(intent)
            .strip()
            .upper()
        )

        # ----------------------------------------------------
        # MEDICINE NAME
        # ----------------------------------------------------

        medicine_name = normalize_medicine_name(
            data.get("medicine_name")
        )

        # ----------------------------------------------------
        # MEDICINE NAMES
        # ----------------------------------------------------

        medicine_names = normalize_medicine_names(
            data.get(
                "medicine_names",
                []
            )
        )

        # ----------------------------------------------------
        # VALIDATE INTENT
        # ----------------------------------------------------

        if intent not in ALLOWED_INTENTS:

            print(
                "WARNING: Invalid intent:",
                repr(intent)
            )

            return default_result()

        # ----------------------------------------------------
        # INTERACTION
        # ----------------------------------------------------
        #
        # Multiple medicines belong in medicine_names.
        #
        # Example:
        # cetirizine + Dolo 650
        #
        # medicine_name = None
        # medicine_names = [...]
        # ----------------------------------------------------

        if intent == "MEDICINE_INTERACTION":

            if medicine_name:

                if medicine_name not in medicine_names:

                    medicine_names.insert(
                        0,
                        medicine_name
                    )

                medicine_name = None

        # ----------------------------------------------------
        # SINGLE MEDICINE
        # ----------------------------------------------------

        elif (
            medicine_name is None
            and len(medicine_names) == 1
        ):

            medicine_name = medicine_names[0]

            medicine_names = []

        # ----------------------------------------------------
        # FINAL RESULT
        # ----------------------------------------------------

        result = {
            "intent": intent,
            "medicine_name": medicine_name,
            "medicine_names": medicine_names,
        }

        print(
            "PARSED ROUTER RESULT:",
            result
        )

        return result

    except json.JSONDecodeError as e:

        print(
            "LLM ROUTER JSON ERROR:",
            str(e)
        )

        return default_result()

    except Exception as e:

        print(
            "LLM ROUTER ERROR:",
            str(e)
        )

        return {
            "intent": "ROUTER_ERROR",
            "medicine_name": None,
            "medicine_names": []
        }