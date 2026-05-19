from functools import lru_cache
from pathlib import Path
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from app.config import settings


@lru_cache(maxsize=1)
def get_vectorstore() -> FAISS:
    embeddings = OpenAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        api_key=settings.OPENAI_API_KEY,
    )
    index_path = str(Path(settings.FAISS_INDEX_PATH))
    return FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)


async def retrieve_card_context(card_name_en: str, position_label: str) -> str:
    vectorstore = get_vectorstore()
    query = f"{card_name_en} tarot card {position_label} position meaning"
    docs = vectorstore.similarity_search(query, k=3)
    return "\n\n---\n\n".join([doc.page_content for doc in docs])
