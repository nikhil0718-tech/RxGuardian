def classify_query(
    query: str
):

    query = query.lower()

    rag_keywords = [

    "miss",
    "missed",
    "forgot",
    "forgot medicine",
    "forgot dose",

    "interaction",
    "drug interaction",

    "safety",
    "guideline",

    "overdose",
    "double dose",

    "side effect",
    "adverse effect"
]

    for keyword in rag_keywords:

        if keyword in query:

            return "rag"

    return "json"