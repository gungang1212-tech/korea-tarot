import json
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.reading import Reading
from app.models.selected_card import SelectedCard
from app.models.card import Card
from app.schemas.reading import CreateReadingRequest, ReadingListItem, SelectedCardSummary


POSITION_LABELS = {1: "과거", 2: "현재", 3: "미래"}


def get_cards_for_ai(db: Session, card_inputs: list) -> list[dict]:
    result = []
    for ci in card_inputs:
        card = db.get(Card, ci.card_id)
        if not card:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"카드 ID {ci.card_id}를 찾을 수 없습니다",
            )
        result.append(
            {
                "card_id": card.id,
                "name_en": card.name_en,
                "name_ko": card.name_ko,
                "position": ci.position,
                "position_label": POSITION_LABELS[ci.position],
                "is_reversed": ci.is_reversed,
            }
        )
    return result


def save_reading(db: Session, user_id: int, concern: str, cards: list, ai_result: dict) -> Reading:
    reading = Reading(user_id=user_id, concern=concern, result=json.dumps(ai_result, ensure_ascii=False))
    db.add(reading)
    db.flush()

    for card_data in cards:
        sc = SelectedCard(
            reading_id=reading.id,
            card_id=card_data["card_id"],
            position=card_data["position"],
            is_reversed=card_data["is_reversed"],
        )
        db.add(sc)

    db.commit()
    db.refresh(reading)
    return reading


def get_reading_list(db: Session, user_id: int, page: int, limit: int) -> tuple[int, list]:
    query = (
        db.query(Reading)
        .options(joinedload(Reading.selected_cards).joinedload(SelectedCard.card))
        .filter(Reading.user_id == user_id)
        .order_by(Reading.created_at.desc())
    )
    total = query.count()
    readings = query.offset((page - 1) * limit).limit(limit).all()

    items = []
    for r in readings:
        cards_summary = [
            SelectedCardSummary(
                card_id=sc.card_id,
                name_ko=sc.card.name_ko,
                image_url=sc.card.image_url,
                is_reversed=sc.is_reversed,
            )
            for sc in sorted(r.selected_cards, key=lambda x: x.position)
        ]
        items.append(
            ReadingListItem(
                id=r.id,
                concern=r.concern,
                cards=cards_summary,
                created_at=r.created_at,
            )
        )
    return total, items


def get_reading_detail(db: Session, reading_id: int, user_id: int) -> Reading:
    reading = (
        db.query(Reading)
        .options(joinedload(Reading.selected_cards).joinedload(SelectedCard.card))
        .filter(Reading.id == reading_id)
        .first()
    )
    if not reading:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="리딩을 찾을 수 없습니다")
    if reading.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="접근 권한이 없습니다")
    return reading
