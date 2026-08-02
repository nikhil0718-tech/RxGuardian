from app.rag.query_classifier import (
    classify_query
)

from app.rag.rag_service import (
    ask_rag
)

from app.rag.json_service import (
    ask_json
)

from app.rag.json_retriever import (
    get_medicine_data
)


def ask_hybrid(
    question,
    medicine_name
):

    query_type = (
        classify_query(
            question
        )
    )

    if query_type == "rag":

        return ask_rag(
            question
        )

    medicine_data = (
        get_medicine_data(
            medicine_name
        )
    )

    if not medicine_data:

        return (
            "Medicine not found."
        )

    return ask_json(

        question,

        medicine_data

    )