import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pathlib import Path
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from app.config import settings
from app.data.loader import load_tarot_documents


def build_index():
    index_path = Path(settings.FAISS_INDEX_PATH)

    if (index_path / "index.faiss").exists():
        print("FAISS index already exists, skipping build.")
        return

    print("Loading tarot documents...")
    docs = load_tarot_documents()

    splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=60)
    chunks = splitter.split_documents(docs)
    print(f"Created {len(chunks)} chunks from {len(docs)} cards")

    print("Building FAISS index...")
    embeddings = OpenAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        api_key=settings.OPENAI_API_KEY,
    )
    vectorstore = FAISS.from_documents(chunks, embeddings)

    index_path.mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(str(index_path))
    print(f"FAISS index saved to {index_path}")


if __name__ == "__main__":
    build_index()
