from app.rag.vector_store import VectorStore
from app.rag.llm_service import LLMService


class ChatService:

    def __init__(self):

        self.vector_store = VectorStore()

        self.llm_service = LLMService()

    def ask(
        self,
        question
    ):

        results = self.vector_store.search(
            query=question,
            n_results=5
        )

        documents = results["documents"][0]

        metadatas = results["metadatas"][0]

        context = "\n\n".join(
            documents
        )

        answer = (
            self.llm_service
            .generate_answer(
                question=question,
                context=context
            )
        )

        sources = []

        for metadata in metadatas:

            sources.append(
                metadata["source"]
            )

        return {
            "answer": answer,
            "sources": list(
                set(sources)
            )
        }