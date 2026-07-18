import chromadb
from pathlib import Path

from app.rag.embedding_service import EmbeddingService


class VectorStore:

    def __init__(self):

        # --------------------------------------------------
        # PERSISTENT CHROMADB STORAGE
        # --------------------------------------------------

        db_path = Path("chroma_db")

        self.client = chromadb.PersistentClient(
            path=str(db_path)
        )

        # --------------------------------------------------
        # DOCUMENT COLLECTION
        # --------------------------------------------------

        self.collection = self.client.get_or_create_collection(
            name="industrial_documents"
        )

        # --------------------------------------------------
        # EMBEDDING SERVICE
        # --------------------------------------------------

        self.embedding_service = EmbeddingService()

    # ==================================================
    # CLEAR ALL DOCUMENTS
    # ==================================================

    def clear_all_documents(self):

        existing = self.collection.get()

        ids = existing.get(
            "ids",
            []
        )

        if ids:

            self.collection.delete(
                ids=ids
            )

        return {
            "deleted_chunks": len(ids)
        }

    # ==================================================
    # ADD DOCUMENT CHUNKS
    # ==================================================

    def add_documents(
        self,
        documents,
        metadatas,
        ids
    ):

        embeddings = (
            self.embedding_service
            .create_embeddings(
                documents
            )
        )

        self.collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )

    # ==================================================
    # SEARCH DOCUMENTS
    # ==================================================

    def search(
        self,
        query,
        n_results=5
    ):

        query_embedding = (
            self.embedding_service
            .create_embeddings(
                [query]
            )[0]
        )

        results = self.collection.query(
            query_embeddings=[
                query_embedding
            ],
            n_results=n_results
        )

        return results

    # ==================================================
    # LIST ALL DOCUMENTS
    # ==================================================

    def list_documents(self):

        results = self.collection.get(
            include=[
                "metadatas"
            ]
        )

        metadatas = results.get(
            "metadatas",
            []
        )

        documents = {}

        for metadata in metadatas:

            if not metadata:
                continue

            # Support both metadata names:
            # filename and source
            filename = (
                metadata.get("filename")
                or metadata.get("source")
            )

            if not filename:
                continue

            if filename not in documents:

                documents[filename] = {
                    "name": filename,
                    "pages": metadata.get(
                        "pages",
                        0
                    ),
                    "chunks": 0
                }

            documents[filename][
                "chunks"
            ] += 1

        return list(
            documents.values()
        )

    # ==================================================
    # DELETE ONE DOCUMENT
    # ==================================================

    def delete_document(
        self,
        filename
    ):

        # Search using both possible
        # metadata field names
        results = self.collection.get(
            include=[
                "metadatas"
            ]
        )

        ids_to_delete = []

        ids = results.get(
            "ids",
            []
        )

        metadatas = results.get(
            "metadatas",
            []
        )

        for index, metadata in enumerate(
            metadatas
        ):

            if not metadata:
                continue

            stored_filename = (
                metadata.get("filename")
                or metadata.get("source")
            )

            if stored_filename == filename:

                ids_to_delete.append(
                    ids[index]
                )

        if ids_to_delete:

            self.collection.delete(
                ids=ids_to_delete
            )

        return {
            "message": (
                "Document deleted successfully"
            ),
            "filename": filename,
            "deleted_chunks": len(
                ids_to_delete
            )
        }