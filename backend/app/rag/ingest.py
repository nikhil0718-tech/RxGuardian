import os

import chromadb

from app.rag.embeddings import (
    embedding_model
)

CHROMA_PATH = (
    "app/rag/chroma_db"
)

DOCS_PATH = (
    "app/rag/documents"
)

client = chromadb.PersistentClient(
    path=CHROMA_PATH
)

collection = client.get_or_create_collection(
    name="rxguardian_docs"
)

for filename in os.listdir(
    DOCS_PATH
):

    file_path = os.path.join(
        DOCS_PATH,
        filename
    )

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as f:

        text = f.read()

    embedding = (
        embedding_model
        .encode(text)
        .tolist()
    )

    collection.add(

        ids=[filename],

        documents=[text],

        embeddings=[embedding]

    )

print(
    "Documents stored successfully."
)

# What This Does
# TXT Files
#       ↓
# Embeddings
#       ↓
# ChromaDB