from app.services.llm_router import (
    llm_classify
)
def classify_query(query):

    query = query.lower()

    print("QUERY:", query)

    # REMINDER FIRST

    if any(
        word in query
        for word in [

            "did i miss",
            "miss any medicine",
            "miss any medicines",
            "have i missed",
            "pending medicine",
            "pending medicines",
            "missed medicines",

            "due medicine",

            "pending medicine",

            "pending medicines",

            "reminders",

            "reminder status"
        ]
    ):
        return "reminder"
    # ==========================
    # JSON QUERIES
    # ==========================

    if any(
        word in query
        for word in [

            "used for",

            "usage",

            "side effect",
            "side effects",

            "dosage",

            "best time",

            "generic name",

            "what is it",

            "tell me about",

            "explain this medicine",

            "what does this medicine do"
        ]
    ):
        return "json"


    # ==========================
    # RAG QUERIES
    # ==========================

    if any(
        word in query
        for word in [

            "miss dose",
            "missed dose",

            "miss medicine",
            "missed medicine",

            "forgot",
            "forgot dose",

            "interaction",
            "interactions",

            "overdose",

            "double dose",

            "safety",

            "warning",

            "precaution",
            "precautions",

            "storage",

            "together"
        ]
    ):
        return "rag"
    # ==========================
    # PRESCRIPTION TOOL
    # ==========================

    if any(
        word in query
        for word in [

            "today medicines",

            "what medicines",

            "my medicines",

            "my prescription",

            "prescribed medicines",

            "active medicines",

            "current medicines",

            "what should i take today"
        ]
    ):
        return "prescription"
    print(
        "USING LLM ROUTER"
    )

    route = llm_classify(
        query
    )

    print(
        "LLM ROUTE:",
        route
    )

    return route