import re


INVALID_MEDICINES = {

    "it",
    "its",
    "this",
    "that",
    "this medicine",
    "that medicine",
    "medicine",
    "tablet",
    "pill",
    "drug",
    "about it",
    "about this",
    "about that"

}


def extract_unknown_medicine(message):

    message = message.lower().strip()

    patterns = [

        r"what is (.+?) used for\??$",
        r"side effects of (.+?)\??$",
        r"tell me about (.+?)\??$",
        r"explain (.+?)\??$",
        r"describe (.+?)\??$",
        r"details of (.+?)\??$",
        r"information about (.+?)\??$"

    ]

    for pattern in patterns:

        match = re.search(pattern, message)

        if not match:
            continue

        medicine = match.group(1).strip()

        medicine = medicine.replace(".", "")
        medicine = medicine.replace("?", "")
        medicine = medicine.strip()

        if medicine in INVALID_MEDICINES:
            return None

        return medicine

    return None