def fuse_results(

    cnn_prediction,

    ocr_text
):

    medicine_name = cnn_prediction[
        "medicine_name"
    ]

    confidence = cnn_prediction[
        "confidence"
    ]

    ocr_match = False

    if medicine_name.lower() in ocr_text:

        ocr_match = True

        confidence += 10

    # LIMIT MAX CONFIDENCE

    if confidence > 100:

        confidence = 100

    return {

        "medicine_name": medicine_name,

        "confidence": confidence,

        "ocr_match": ocr_match
    }