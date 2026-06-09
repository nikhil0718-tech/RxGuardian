from ai_engine.inference.hybrid_engine import (
    hybrid_predict
)

from app.models.prescription_model import (
    Prescription
)

# =====================================================
# VERIFY TABLET LOGIC
# =====================================================

def verify_tablet_logic(

    patient_id,

    image_path,

    db
):

    # =====================================
    # AI PREDICTION
    # =====================================

    result = hybrid_predict(
        image_path
    )

    predicted_medicine = result[
        "medicine_name"
    ]

    confidence_score = result[
        "confidence_score"
    ]

    print(
        "AI PREDICTED =",
        predicted_medicine
    )

    print(
        "CONFIDENCE =",
        confidence_score
    )

    # =====================================
    # LOW CONFIDENCE SAFETY
    # =====================================

    if confidence_score < 60:

        return {

            "medicine_name":
            predicted_medicine,

            "confidence_score":
            confidence_score,

            "status":
            "Not Matched"
        }

    # =====================================
    # FETCH PRESCRIPTIONS
    # =====================================

    prescriptions = db.query(
        Prescription
    ).filter(

        Prescription.patient_id
        == patient_id

    ).all()

    matched_prescription = None

    # =====================================
    # NORMALIZE TEXT
    # =====================================

    normalized_prediction = (

        predicted_medicine
        .lower()
        .replace("_", "")
        .replace(" ", "")
    )

    # =====================================
    # MATCH PRESCRIPTIONS
    # =====================================

    for prescription in prescriptions:

        normalized_prescription = (

            prescription.medicine_name
            .lower()
            .replace("_", "")
            .replace(" ", "")
        )

        print(
            "COMPARING:",
            normalized_prediction,
            normalized_prescription
        )

        if (

            normalized_prediction

            ==

            normalized_prescription
        ):

            matched_prescription = prescription

            break

    # =====================================
    # CORRECT MEDICINE
    # =====================================

    if matched_prescription:

        return {

            "medicine_name":
            predicted_medicine,

            "confidence_score":
            confidence_score,

            "status":
            "Correct Medicine",

            "prescription_details": {

                "dosage":
                matched_prescription.dosage,

                "frequency":
                matched_prescription.frequency,

                "duration":
                matched_prescription.duration,

                "timing":
                matched_prescription.timing
            }
        }

    # =====================================
    # WRONG MEDICINE
    # =====================================

    return {

        "medicine_name":
        predicted_medicine,

        "confidence_score":
        confidence_score,

        "status":
        "Not Matched"
    }