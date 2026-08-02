from rapidfuzz import fuzz
import re
import torch

from ai_engine.inference.predictor import (
    predict_medicine
)

from ai_engine.ocr.ocr_engine import (
    extract_text
)

# =====================================================
# DEVICE
# =====================================================

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print(f"Hybrid Engine Using: {DEVICE}")

# =====================================================
# CLASS LABELS
# =====================================================

CLASS_NAMES = [

    "ascoril",
    "augmentin",
    "azithromycin",
    "cetirizine",
    "combiflam",
    "crocin",
    "dolo_650",
    "pantoprazole",
    "sinarest",
    "zincovit"
]

# =====================================================
# CLEAN TEXT
# =====================================================

def clean_text(text):

    text = text.lower()

    text = re.sub(
        r"[^a-zA-Z0-9\s]",
        "",
        text
    )

    return text

# =====================================================
# HYBRID ENGINE
# =====================================================

def hybrid_predict(image_path):

    # =================================================
    # CNN PREDICTION
    # =================================================

    cnn_result = predict_medicine(
        image_path=image_path,
        device=DEVICE
    )

    cnn_prediction = cnn_result[
        "medicine_name"
    ]

    cnn_confidence = cnn_result[
        "confidence_score"
    ]
    print("CNN PREDICTION =", cnn_prediction)
    print("CNN CONFIDENCE =", cnn_confidence)
    # =================================================
    # OCR EXTRACTION
    # =================================================

    extracted_text = extract_text(
        image_path
    )

    extracted_text = clean_text(
        extracted_text
    )

    print("\nOCR TEXT:\n")
    print(extracted_text)

    # =================================================
    # FUZZY OCR MATCHING
    # =================================================

    ocr_prediction = None

    highest_score = 0

    for medicine in CLASS_NAMES:

        formatted_name = medicine.replace(
            "_",
            " "
        )

        score = fuzz.partial_ratio(

            formatted_name.lower(),

            extracted_text.lower()
        )

        print(
            formatted_name,
            "->",
            score
        )

        if score > highest_score:

            highest_score = score

            ocr_prediction = medicine

    print("OCR PREDICTION =", ocr_prediction)
    print("OCR SCORE =", highest_score)

    # =================================================
    # HYBRID CONFIDENCE LOGIC
    # =================================================

    if (
        ocr_prediction ==
        cnn_prediction
    ):

        # Both agree
        final_prediction = cnn_prediction

        confidence_score = max(
            cnn_confidence,
            highest_score
        )

        prediction_source = "OCR + CNN AGREEMENT"

    elif highest_score >= 85:

        # OCR very strong
        final_prediction = ocr_prediction

        confidence_score = highest_score

        prediction_source = "OCR"

    elif cnn_confidence >= 80:

        # CNN reliable
        final_prediction = cnn_prediction

        confidence_score = cnn_confidence

        prediction_source = "CNN"

    else:

        # fallback
        final_prediction = cnn_prediction

        confidence_score = cnn_confidence

        prediction_source = "LOW CONFIDENCE"

    # =================================================
    # RETURN
    # =================================================

    return {

        "medicine_name":
        final_prediction,

        "confidence_score":
        round(
            confidence_score,
            2
        ),

        "prediction_source":
        prediction_source,

        "ocr_prediction":
        ocr_prediction,

        "ocr_score":
        highest_score,

        "cnn_prediction":
        cnn_prediction,

        "cnn_confidence":
        cnn_confidence,

        "device_used":
        DEVICE
    }