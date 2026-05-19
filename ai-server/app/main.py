from fastapi import FastAPI
from app.routers.interpret import router as interpret_router

app = FastAPI(title="Arcana AI Server", version="1.0.0")

app.include_router(interpret_router, tags=["interpret"])


@app.get("/health")
def health():
    return {"status": "ok"}
