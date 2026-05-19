from fastapi import APIRouter
from pydantic import BaseModel
from app.services.llm_service import interpret_all

router = APIRouter()


class CardInput(BaseModel):
    card_id: int
    name_en: str
    name_ko: str
    position: int
    position_label: str
    is_reversed: bool


class InterpretRequest(BaseModel):
    concern: str
    cards: list[CardInput]


@router.post("/interpret")
async def interpret(request: InterpretRequest):
    cards = [c.model_dump() for c in request.cards]
    return await interpret_all(request.concern, cards)
