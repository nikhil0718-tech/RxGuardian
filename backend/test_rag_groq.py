from app.rag.rag_service import (
    ask_rag
)

answer = ask_rag(

    "What are Pantoprazole side effects?"

)

print(answer)