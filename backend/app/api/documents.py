from fastapi import APIRouter, HTTPException

from app.rag.vector_store import VectorStore


router = APIRouter()

vector_store = VectorStore()


@router.get("/documents")
def get_documents():

    documents = vector_store.list_documents()

    return {
        "documents": documents
    }


@router.delete("/documents/{filename}")
def delete_document(filename: str):

    result = vector_store.delete_document(
        filename
    )

    if result["deleted_chunks"] == 0:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return result