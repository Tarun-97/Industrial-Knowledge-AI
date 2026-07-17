from fastapi import APIRouter, UploadFile, File

from app.services.pdf_service import (
    save_pdf,
    extract_text
)

from app.rag.ingestion import ingest_pdf


router = APIRouter()


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):

    filepath = save_pdf(file)

    result = ingest_pdf(filepath)

    return result