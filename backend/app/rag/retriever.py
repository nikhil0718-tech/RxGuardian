import chromadb

from app.rag.embeddings import (
    embedding_model
)

CHROMA_PATH = (
    "app/rag/chroma_db"
)

client = chromadb.PersistentClient(
    path=CHROMA_PATH
)

collection = client.get_collection(
    name="rxguardian_docs"
)


def retrieve(query):

    query_embedding = (
        embedding_model
        .encode(query)
        .tolist()
    )

    results = collection.query(

        query_embeddings=[
            query_embedding
        ],

        n_results=2

    )

    return results["documents"][0]