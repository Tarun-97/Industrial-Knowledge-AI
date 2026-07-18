from pathlib import Path
import uuid

from app.services.pdf_service import extract_text
from app.rag.chunking import split_text
from app.rag.vector_store import VectorStore


# Create one shared vector store instance
vector_store = VectorStore()


def ingest_pdf(filepath: Path):

    # --------------------------------------------------
    # EXTRACT PDF TEXT
    # --------------------------------------------------

    data = extract_text(
        filepath
    )

    text = data["text"]

    # --------------------------------------------------
    # SPLIT TEXT INTO CHUNKS
    # --------------------------------------------------

    chunks = split_text(
        text
    )

    # --------------------------------------------------
    # CLEAR OLD KNOWLEDGE BASE
    # --------------------------------------------------

    vector_store.clear_all_documents()

    # --------------------------------------------------
    # CREATE NEW DOCUMENT ID
    # --------------------------------------------------

    document_id = str(
        uuid.uuid4()
    )

    # --------------------------------------------------
    # PREPARE METADATA
    # --------------------------------------------------

    documents = chunks

    metadatas = [

        {
            "source": filepath.name,
            "document_id": document_id,
            "chunk_index": index
        }

        for index, chunk in enumerate(
            chunks
        )

    ]

    # --------------------------------------------------
    # CREATE UNIQUE CHUNK IDS
    # --------------------------------------------------

    ids = [

        f"{document_id}_{index}"

        for index in range(
            len(chunks)
        )

    ]

    # --------------------------------------------------
    # STORE NEW DOCUMENT
    # --------------------------------------------------

    vector_store.add_documents(

        documents=documents,

        metadatas=metadatas,

        ids=ids

    )

    # --------------------------------------------------
    # RETURN UPLOAD RESULT
    # --------------------------------------------------

    return {

        "document_id": document_id,

        "filename": filepath.name,

        "chunks": len(
            chunks
        ),

        "pages": data["pages"]

    }