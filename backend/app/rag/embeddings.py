from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# Why?

# This model converts:

# What should I do if I miss Dolo 650?

# into:

# Vector Embedding

# which ChromaDB can search.

# This is your first real RAG component.