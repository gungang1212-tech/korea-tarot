from pydantic import BaseModel


class CardSummary(BaseModel):
    id: int
    name_ko: str
    name_en: str
    arcana: str
    suit: str | None = None
    image_url: str | None = None

    model_config = {"from_attributes": True}


class CardDetail(CardSummary):
    number: int | None = None
    description: str | None = None
