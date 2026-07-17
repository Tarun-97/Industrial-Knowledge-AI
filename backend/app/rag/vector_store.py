import chromadb
from pathlib import Path

from app.rag.embedding_service import EmbeddingService


class VectorStore:

    def __init__(self):

        db_path = Path("chroma_db")

        self.client = chromadb.PersistentClient(
            path=str(db_path)
        )

        self.collection = self.client.get_or_create_collection(
            name="industrial_documents"
        )

        self.embedding_service = EmbeddingService()

    def add_documents(
        self,
        documents,
        metadatas,
        ids
    ):

        embeddings = (
            self.embedding_service
            .create_embeddings(documents)
        )

        self.collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )

    def search(
        self,
        query,
        n_results=5
    ):

        query_embedding = (
            self.embedding_service
            .create_embeddings([query])[0]
        )

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )

        return results

    def list_documents(self):

        results = self.collection.get(
            include=["metadatas"]
        )

        metadatas = results.get("metadatas", [])

        documents = {}

        for metadata in metadatas:

            if not metadata:
                continue

            filename = metadata.get("filename")

            if not filename:
                continue

            if filename not in documents:

                documents[filename] = {
                    "name": filename,
                    "pages": metadata.get("pages", 0),
                    "chunks": 0
                }

            documents[filename]["chunks"] += 1

        return list(documents.values())