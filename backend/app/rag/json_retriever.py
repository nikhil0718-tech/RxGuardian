import json

JSON_PATH = (
    "ai_engine/data/medicine_data.json"
)


def get_medicine_data(
    medicine_name
):

    with open(
        JSON_PATH,
        "r",
        encoding="utf-8"
    ) as f:

        medicines = json.load(f)

    return medicines.get(
        medicine_name.lower()
    )