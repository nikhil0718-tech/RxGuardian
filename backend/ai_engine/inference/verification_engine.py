from ai_engine.inference.predictor import (
    predict_medicine
)

from ai_engine.ocr.easyocr_engine import (
    extract_text
)

import torch
import re

# ---------------------------------------------------
# DEVICE
# ---------------------------------------------------

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print(f"Using Device: {DEVICE}")

# ---------------------------------------------------
# KNOWN MEDICINES
# ---------------------------------------------------

MEDICINE_ALIASES = {

    "ascoril": ["ascoril"],

    "augmentin": ["augmentin"],

    "azithromycin": [
        "azithromycin"
    ],

    "cetirizine": [
        "cetirizine"
    ],

    "combiflam": [
        "combiflam"
    ],

    "crocin": [
        "crocin",
        "paracetamol"
    ],

    "dolo_650": [
        "dolo 650",
        "paracetamol"
    ],

    "pantoprazole": [
        "pantoprazole"
    ],

    "sinarest": [
        "sinarest"
    ],

    "zincovit": [
        "zincovit"
    ]
}

# ---------------------------------------------------
# CLEAN OCR TEXT
# ---------------------------------------------------

def clean_text(text):

    text = text.lower()

    text = re.sub(
        r"[^a-zA-Z0-9\s]",
        "",
        text
    )

    return text.strip()

# ---------------------------------------------------
# VERIFY TABLET
# ---------------------------------------------------

def verify_tablet(

    image_path,

    prescriptions
):

    try:

        # ---------------------------------------------------
        # CNN PREDICTION
        # ---------------------------------------------------

        prediction_result = predict_medicine(
            image_path=image_path,
            device=DEVICE
        )

        cnn_prediction = prediction_result[
            "medicine_name"
        ]

        cnn_confidence = prediction_result[
            "confidence_score"
        ]

        # ---------------------------------------------------
        # OCR EXTRACTION
        # ---------------------------------------------------

        extracted_text = extract_text(
            image_path=image_path
        )

        extracted_text = clean_text(
            extracted_text
        )

        print("OCR TEXT:", extracted_text)

        # ---------------------------------------------------
        # OCR MATCHING
        # ---------------------------------------------------

        ocr_detected_medicine = None

        for medicine, aliases in MEDICINE_ALIASES.items():

            for alias in aliases:

                if alias.lower() in extracted_text:

                    ocr_detected_medicine = medicine

                    break

            if ocr_detected_medicine:

                break

        # ---------------------------------------------------
        # FINAL DECISION
        # ---------------------------------------------------

        if (
            ocr_detected_medicine
            and
            ocr_detected_medicine == cnn_prediction
        ):

            # OCR + CNN agree

            final_medicine = cnn_prediction

            final_confidence = max(
                98.0,
                cnn_confidence
            )

            prediction_source = "OCR + CNN"

        elif ocr_detected_medicine:

            # OCR dominates

            final_medicine = ocr_detected_medicine

            final_confidence = max(
                95.0,
                cnn_confidence
            )

            prediction_source = "OCR"

        else:

            # fallback to CNN

            final_medicine = cnn_prediction

            final_confidence = cnn_confidence

            prediction_source = "CNN"

        # ---------------------------------------------------
        # PRESCRIPTION MATCH
        # ---------------------------------------------------

        matched_prescription = None

        for prescription in prescriptions:

            if (
                prescription.medicine_name.lower().strip()
                ==
                final_medicine.lower().strip()
            ):

                matched_prescription = prescription

                break

        # ---------------------------------------------------
        # STATUS
        # ---------------------------------------------------

        status = (
            "Correct Medicine"
            if matched_prescription
            else
            "Not Matched"
        )

        # ---------------------------------------------------
        # RESPONSE
        # ---------------------------------------------------

        response = {

            "medicine_name": final_medicine,

            "confidence_score": round(
                final_confidence,
                2
            ),

            "status": status,

            "prediction_source":
            prediction_source,

            "cnn_prediction":
            cnn_prediction,

            "ocr_prediction":
            ocr_detected_medicine,

            "device_used":
            DEVICE
        }

        # ---------------------------------------------------
        # PRESCRIPTION DETAILS
        # ---------------------------------------------------

        if matched_prescription:

            response["prescription_details"] = {

                "dosage":
                matched_prescription.dosage,

                "frequency":
                matched_prescription.frequency,

                "duration":
                matched_prescription.duration,

                "timing":
                matched_prescription.timing
            }

        return response

    except Exception as e:

        return {

            "medicine_name": "Unknown",

            "confidence_score": 0.0,

            "status": "Error",

            "error": str(e),

            "device_used": DEVICE
        }