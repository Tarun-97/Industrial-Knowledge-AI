from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.vector_store import VectorStore


router = APIRouter()

vector_store = VectorStore()


class SearchRequest(BaseModel):

    query: str

    n_results: int = 5


@router.post("/search")
async def search_documents(
    request: SearchRequest
):

    results = vector_store.search(
        query=request.query,
        n_results=request.n_results
    )

    return results