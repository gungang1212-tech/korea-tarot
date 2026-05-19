from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.routers import auth, readings, cards

Base.metadata.create_all(bind=engine)

from app.seeds.cards import seed as seed_cards
seed_cards()

app = FastAPI(title="Arcana API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(readings.router, prefix="/readings", tags=["readings"])
app.include_router(cards.router, prefix="/cards", tags=["cards"])


@app.get("/health")
def health():
    return {"status": "ok"}
