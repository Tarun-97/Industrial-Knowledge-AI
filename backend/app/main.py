from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.upload import router as upload_router
from app.api.search import router as search_router
from app.api.chat import router as chat_router
from app.api.documents import router as documents_router


app = FastAPI(
    title="Industrial Knowledge AI",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    upload_router,
    prefix="/api",
    tags=["Upload"]
)


app.include_router(
    search_router,
    prefix="/api",
    tags=["Search"]
)


app.include_router(
    chat_router,
    prefix="/api",
    tags=["Chat"]
)


app.include_router(
    documents_router,
    prefix="/api",
    tags=["Documents"]
)


@app.get("/")
def home():

    return {
        "message": "Industrial Knowledge AI API is running 🚀"
    }