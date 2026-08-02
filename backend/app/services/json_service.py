import json


class JsonService:

    @staticmethod
    def get_medicine_data(
        medicine_name
    ):
        

        with open(
            "ai_engine/data/medicine_data.json",
            "r"
        ) as file:

            data = json.load(file)
        
        if not medicine_name:
            return None

        medicine_name = (
            medicine_name
            .lower()
            .replace(" ", "_")
        )

        return data.get(
            medicine_name
        )