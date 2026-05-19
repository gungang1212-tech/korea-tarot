from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse, AccessTokenResponse
from app.services.auth_service import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
)

router = APIRouter()

REFRESH_COOKIE = "refresh_token"
COOKIE_MAX_AGE = 7 * 24 * 3600


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"detail": "이미 사용 중인 이메일입니다", "code": "EMAIL_ALREADY_EXISTS"},
        )
    user = User(
        email=body.email,
        password=hash_password(body.password),
        nickname=body.nickname,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"detail": "이메일 또는 비밀번호가 올바르지 않습니다", "code": "INVALID_CREDENTIALS"},
        )
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    response.set_cookie(
        key=REFRESH_COOKIE,
        value=refresh_token,
        httponly=True,
        max_age=COOKIE_MAX_AGE,
        samesite="lax",
    )
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get(REFRESH_COOKIE)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token이 없습니다")
    payload = decode_token(token, token_type="refresh")
    user_id = int(payload.get("sub"))
    if not db.get(User, user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="사용자를 찾을 수 없습니다")
    return AccessTokenResponse(access_token=create_access_token(user_id))


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key=REFRESH_COOKIE)
    return {"message": "로그아웃 되었습니다"}
