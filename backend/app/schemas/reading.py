from datetime import datetime
from pydantic import BaseModel, field_validator
from app.schemas.card import CardSummary


class CardInput(BaseModel):
    card_id: int
    position: int
    is_reversed: bool = False


class CreateReadingRequest(BaseModel):
    concern: str
    cards: list[CardInput]

    @field_validator("cards")
    @classmethod
    def validate_cards(cls, v: list[CardInput]) -> list[CardInput]:
        if len(v) != 3:
            raise ValueError("카드는 정확히 3장 선택해야 합니다")
        positions = [c.position for c in v]
        if len(set(positions)) != 3 or set(positions) != {1, 2, 3}:
            raise ValueError("포지션은 1, 2, 3이 각각 하나씩 있어야 합니다")
        card_ids = [c.card_id for c in v]
        if len(set(card_ids)) != 3:
            raise ValueError("중복된 카드는 선택할 수 없습니다")
        return v


class SelectedCardSummary(BaseModel):
    card_id: int
    name_ko: str
    image_url: str | None = None
    is_reversed: bool

    model_config = {"from_attributes": True}


class ReadingListItem(BaseModel):
    id: int
    concern: str
    cards: list[SelectedCardSummary]
    created_at: datetime

    model_config = {"from_attributes": True}


class CardInterpretation(BaseModel):
    position: int
    position_label: str
    card_name_ko: str
    card_name_en: str
    is_reversed: bool
    interpretation: str


class ReadingResult(BaseModel):
    cards: list[CardInterpretation]
    summary: str
    advice: str


class ReadingDetail(BaseModel):
    id: int
    concern: str
    result: ReadingResult
    created_at: datetime

    model_config = {"from_attributes": True}


class ReadingListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: list[ReadingListItem]
