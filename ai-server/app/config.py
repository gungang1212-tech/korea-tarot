from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""
    FAISS_INDEX_PATH: str = "faiss_index/"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    LLM_MODEL: str = "gpt-4o"
    LLM_MAX_TOKENS: int = 500

    model_config = {"env_file": ".env"}


settings = Settings()
