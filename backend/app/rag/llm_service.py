import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI


load_dotenv()


class LLMService:

    def __init__(self):

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-3-flash-preview",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.2
        )

    def generate_answer(
        self,
        question,
        context
    ):

        prompt = f"""
You are an Industrial Knowledge Copilot.

Answer the user's question using ONLY
the provided context.

If the answer cannot be found in the
context, say:

"I could not find this information
in the uploaded documents."

Do not invent facts.

CONTEXT:
{context}

QUESTION:
{question}

Provide a clear, concise answer.
"""

        response = self.llm.invoke(prompt)

        content = response.content

        if isinstance(content, list):

            return "\n".join(
                item.get("text", "")
                for item in content
                if isinstance(item, dict)
                and item.get("type") == "text"
            )

        return str(content)