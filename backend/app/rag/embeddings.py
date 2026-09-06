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

# model should be same as chroma db model. If you change the model, you need to re-embed all the data and re-upload to chroma db.