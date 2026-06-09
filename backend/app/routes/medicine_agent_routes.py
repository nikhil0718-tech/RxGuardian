import os
from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File
)

from ai_engine.inference.predictor import (
    predict_medicine
)

from ai_engine.ocr.ocr_engine import (
    extract_text
)

from app.services.medicine_agent_service import (
    MedicineAgentService
)

router = APIRouter(

    prefix="/medicine",

    tags=["Medicine Agent"]
)

UPLOAD_DIR = "uploads"

Path(
    UPLOAD_DIR
).mkdir(
    exist_ok=True
)


@router.post("/analyze")

async def analyze_medicine(

    file: UploadFile = File(...)
):

    file_path = (
        f"{UPLOAD_DIR}/"
        f"{file.filename}"
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        buffer.write(
            await file.read()
        )

    try:

        cnn_result = (
            predict_medicine(
                file_path
            )
        )

        ocr_text = (
            extract_text(
                file_path
            )
        )

        result = (
            MedicineAgentService
            .process(

                cnn_class=
                cnn_result[
                    "medicine_name"
                ],

                confidence=
                cnn_result[
                    "confidence_score"
                ],

                ocr_text=
                ocr_text
            )
        )

        return result

    finally:

        if os.path.exists(file_path):

            os.remove(file_path)