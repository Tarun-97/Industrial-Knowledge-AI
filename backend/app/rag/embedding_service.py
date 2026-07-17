import os

from dotenv import load_dotenv
from google import genai


load_dotenv()


class EmbeddingService:

    def __init__(self):

        api_key = os.getenv(
            "GOOGLE_API_KEY"
        )

        if not api_key:

            raise ValueError(
                "GOOGLE_API_KEY is not configured."
            )

        self.client = genai.Client(
            api_key=api_key
        )

        self.model = (
            "gemini-embedding-001"
        )


    def create_embeddings(self, texts):

        embeddings = []

        for text in texts:

            response = (
                self.client.models.embed_content(
                    model=self.model,
                    contents=text
                )
            )

            embeddings.append(
                response.embeddings[0].values
            )

        return embeddings