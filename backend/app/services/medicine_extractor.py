import json


def extract_medicine(message):

    message = message.lower()

    with open(
        "ai_engine/data/medicine_data.json",
        "r"
    ) as file:

        data = json.load(file)

    medicines = list(
        data.keys()
    )

    for medicine in medicines:

        medicine_check = (
            medicine
            .replace("_", " ")
            .lower()
        )

        if medicine_check in message:

            return medicine

    return None