from app.rag.retriever import (
    retrieve
)

results = retrieve(

    "What should I do if I miss Dolo 650?"

)

print(
    "\nRESULTS:\n"
)

for doc in results:

    print(doc)
    print("\n")

# What happened internally:

# User Query
#       ↓
# Sentence Transformer
#       ↓
# Embedding Vector
#       ↓
# ChromaDB Similarity Search
#       ↓
# Top Matching Documents

# The output proves semantic retrieval is working because it returned:

# ✅ dolo650.txt

# ✅ missed_dose_guidelines.txt

# without you manually specifying those files.