from app.rag.hybrid_assistant import (
    ask_hybrid
)

print(
    ask_hybrid(
        "What is Dolo 650 used for?",
        "dolo_650"
    )
)

print("\n")

print(
    ask_hybrid(
        "What should I do if I miss Dolo 650?",
        "dolo_650"
    )
)

# Expected Result
# Query 1
# What is Dolo 650 used for?

# Flow:

# Classifier
#  ↓
# json
#  ↓
# medicine_data.json
#  ↓
# Groq

# Answer:

# Dolo 650 is used to reduce fever and relieve mild to moderate pain.
# Query 2
# What should I do if I miss Dolo 650?

# Flow:

# Classifier
#  ↓
# rag
#  ↓
# ChromaDB
#  ↓
# Groq

# Answer:

# Take the missed dose as soon as remembered.
# If it is close to the next dose,
# skip the missed dose.
# Do not take two doses together.