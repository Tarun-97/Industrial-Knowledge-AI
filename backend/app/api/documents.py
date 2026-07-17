from fastapi import APIRouter

from app.rag.vector_store import VectorStore


router = APIRouter()

vector_store = VectorStore()


@router.get("/documents")
async def get_documents():

    documents = vector_store.list_documents()

    return {
        "documents": documents
    }