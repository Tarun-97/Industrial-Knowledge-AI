from pathlib import Path
import uuid

from app.services.pdf_service import extract_text
from app.rag.chunking import split_text
from app.rag.vector_store import VectorStore


vector_store = VectorStore()


def ingest_pdf(filepath: Path):

    data = extract_text(filepath)

    text = data["text"]

    chunks = split_text(text)

    document_id = str(uuid.uuid4())

    documents = chunks

    metadatas = [
        {
            "source": filepath.name,
            "document_id": document_id,
            "chunk_index": index
        }

        for index, chunk in enumerate(chunks)
    ]

    ids = [
        f"{document_id}_{index}"

        for index in range(len(chunks))
    ]

    vector_store.add_documents(
        documents=documents,
        metadatas=metadatas,
        ids=ids
    )

    return {
        "document_id": document_id,
        "filename": filepath.name,
        "chunks": len(chunks),
        "pages": data["pages"]
    }