def match_prescription(

    predicted_medicine,

    prescriptions
):

    matched_prescription = None

    for prescription in prescriptions:

        if (
            prescription.medicine_name.lower()
            ==
            predicted_medicine.lower()
        ):

            matched_prescription = prescription

            break

    # =================================================
    # MATCH FOUND
    # =================================================

    if matched_prescription:

        return {

            "status": "Correct Medicine",

            "prescription_details": {

                "dosage": matched_prescription.dosage,

                "frequency": matched_prescription.frequency,

                "duration": matched_prescription.duration,

                "timing": matched_prescription.timing
            }
        }

    # =================================================
    # NO MATCH
    # =================================================

    return {

        "status": "Not Matched",

        "prescription_details": None
    }