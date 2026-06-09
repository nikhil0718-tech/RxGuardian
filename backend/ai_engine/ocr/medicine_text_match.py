from rapidfuzz import fuzz


def check_text_match(
    extracted_text,
    predicted_medicine
):

    extracted_text = (
        extracted_text
        .lower()
        .replace("_", " ")
        .strip()
    )

    predicted_medicine = (
        predicted_medicine
        .lower()
        .replace("_", " ")
        .strip()
    )

    score = fuzz.partial_ratio(
        predicted_medicine,
        extracted_text
    )

    return score >= 80