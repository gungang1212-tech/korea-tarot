import httpx
from fastapi import HTTPException, status
from app.config import settings


async def request_interpretation(concern: str, cards: list[dict]) -> dict:
    payload = {"concern": concern, "cards": cards}
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(f"{settings.AI_SERVER_URL}/interpret", json=payload)
            response.raise_for_status()
            return response.json()
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="AI 서버 응답 시간이 초과되었습니다",
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI 서버 오류: {e.response.status_code}",
        )
    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI 서버에 연결할 수 없습니다",
        )
