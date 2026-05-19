import json
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.reading import (
    CreateReadingRequest, ReadingDetail, ReadingListResponse, ReadingResult,
)
from app.services import reading_service
from app.services.ai_client import request_interpretation

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED, response_model=ReadingDetail)
async def create_reading(
    body: CreateReadingRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cards_for_ai = reading_service.get_cards_for_ai(db, body.cards)
    ai_result = await request_interpretation(body.concern, cards_for_ai)
    reading = reading_service.save_reading(db, current_user.id, body.concern, cards_for_ai, ai_result)

    return ReadingDetail(
        id=reading.id,
        concern=reading.concern,
        result=ReadingResult(**json.loads(reading.result)),
        created_at=reading.created_at,
    )


@router.get("", response_model=ReadingListResponse)
def list_readings(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total, items = reading_service.get_reading_list(db, current_user.id, page, limit)
    return ReadingListResponse(total=total, page=page, limit=limit, items=items)


@router.get("/{reading_id}", response_model=ReadingDetail)
def get_reading(
    reading_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reading = reading_service.get_reading_detail(db, reading_id, current_user.id)
    return ReadingDetail(
        id=reading.id,
        concern=reading.concern,
        result=ReadingResult(**json.loads(reading.result)),
        created_at=reading.created_at,
    )
