import json


ALIASES = {

    "dolo": "dolo_650",
    "dolo 650": "dolo_650",

    "crocin": "crocin",

    "augmentin": "augmentin",

    "cetirizine": "cetirizine",

    "pantoprazole": "pantoprazole",

    "azithromycin": "azithromycin",

    "combiflam": "combiflam",

    "ascoril": "ascoril",

    "sinarest": "sinarest",

    "zincovit": "zincovit"

}


def detect_medicines(message):

    message = message.lower()

    medicines = []

    # Detect aliases first
    for alias, medicine in ALIASES.items():

        if alias in message and medicine not in medicines:

            medicines.append(medicine)

    # Detect remaining medicines from JSON
    with open(
        "ai_engine/data/medicine_data.json",
        "r"
    ) as file:

        data = json.load(file)

    for medicine in data.keys():

        check = medicine.replace("_", " ")

        if check in message and medicine not in medicines:

            medicines.append(medicine)

    return medicines