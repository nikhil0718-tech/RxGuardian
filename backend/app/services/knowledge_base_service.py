import json
from pathlib import Path

class KnowledgeBaseService:

    DATA_PATH = (
        Path(__file__).resolve().parents[2]
        / "ai_engine"
        / "data"
        / "medicine_data.json"
    )

    @classmethod
    def get_medicine(cls, medicine_class):

        with open(
            cls.DATA_PATH,
            "r",
            encoding="utf-8"
        ) as file:

            medicines = json.load(file)

        return medicines.get(
            medicine_class.lower()
        )