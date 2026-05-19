from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.card import Card
from app.schemas.card import CardSummary, CardDetail

router = APIRouter()


@router.get("", response_model=list[CardSummary])
def list_cards(db: Session = Depends(get_db)):
    return db.query(Card).order_by(Card.arcana, Card.suit, Card.number).all()


@router.get("/{card_id}", response_model=CardDetail)
def get_card(card_id: int, db: Session = Depends(get_db)):
    card = db.get(Card, card_id)
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="카드를 찾을 수 없습니다")
    return card
