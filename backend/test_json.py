from app.rag.json_retriever import (
    get_medicine_data
)

data = get_medicine_data(
    "dolo_650"
)

print(data)