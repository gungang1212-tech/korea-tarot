# Backend Spec — 아르카나 (Arcana)

> 버전 1.0 | 기준 기획서: tarot-service-plan.md

---

## 기술 스택

| 항목 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | FastAPI (Python 3.11+) | |
| ORM | SQLAlchemy 2.x + Alembic | 마이그레이션 포함 |
| DB | MySQL 8.x | |
| 인증 | JWT (python-jose) | Access 30분 / Refresh 7일 |
| 비밀번호 | bcrypt (passlib) | |
| 유효성 검증 | Pydantic v2 | |
| HTTP 클라이언트 | httpx | AI 서버 호출용 |
| 환경 변수 | python-dotenv | |
| 테스트 | pytest + httpx | |

---

## 프로젝트 구조

```
backend/
├── app/
│   ├── main.py              # FastAPI 앱 진입점
│   ├── config.py            # 환경 변수 설정
│   ├── database.py          # DB 연결, 세션 관리
│   ├── models/
│   │   ├── user.py
│   │   ├── reading.py
│   │   ├── card.py
│   │   └── selected_card.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── reading.py
│   │   └── card.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── readings.py
│   │   └── cards.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── reading_service.py
│   │   └── ai_client.py     # AI 서버 HTTP 호출
│   └── dependencies/
│       └── auth.py          # JWT 검증 의존성
├── alembic/
├── tests/
├── .env
└── requirements.txt
```

---

## DB 스키마

### users
```sql
CREATE TABLE users (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,       -- bcrypt 해시
  nickname    VARCHAR(100) NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### cards
```sql
CREATE TABLE cards (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name_ko     VARCHAR(100) NOT NULL,       -- "바보"
  name_en     VARCHAR(100) NOT NULL,       -- "The Fool"
  arcana      ENUM('major', 'minor') NOT NULL,
  suit        VARCHAR(50),                 -- minor arcana: Wands/Cups/Swords/Pentacles
  number      TINYINT,                     -- 0~21 (major), 1~14 (minor)
  description TEXT,                        -- 기본 설명 (도감용)
  image_url   VARCHAR(500)                 -- 카드 이미지 경로
);
```

### readings
```sql
CREATE TABLE readings (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  concern     TEXT NOT NULL,               -- 사용자 고민 (암호화 권장)
  result      LONGTEXT NOT NULL,           -- AI 해석 결과 JSON
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### selected_cards
```sql
CREATE TABLE selected_cards (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  reading_id  BIGINT NOT NULL,
  card_id     INT NOT NULL,
  position    TINYINT NOT NULL,            -- 1=과거, 2=현재, 3=미래
  is_reversed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (reading_id) REFERENCES readings(id) ON DELETE CASCADE,
  FOREIGN KEY (card_id) REFERENCES cards(id)
);
```

---

## API 엔드포인트

### Auth

#### POST `/auth/register`
**요청**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "달빛여행자"
}
```
**응답 201**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "달빛여행자"
}
```
**에러**:
- `400` 이미 사용 중인 이메일
- `422` 유효성 검증 실패

---

#### POST `/auth/login`
**요청**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**응답 200**:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "달빛여행자"
  }
}
```
> Refresh Token은 httpOnly Cookie로 설정

**에러**:
- `401` 이메일 또는 비밀번호 불일치

---

#### POST `/auth/refresh`
**요청**: Cookie의 refresh_token 자동 전송
**응답 200**:
```json
{
  "access_token": "eyJ..."
}
```
**에러**:
- `401` Refresh Token 만료 또는 유효하지 않음

---

#### POST `/auth/logout`
**응답 200**: Refresh Token 쿠키 삭제

---

### Readings

#### POST `/readings`
> 인증 필요 (Bearer Token)

**요청**:
```json
{
  "concern": "직장을 옮겨야 할지 고민입니다",
  "cards": [
    { "card_id": 16, "position": 1, "is_reversed": false },
    { "card_id": 7,  "position": 2, "is_reversed": false },
    { "card_id": 17, "position": 3, "is_reversed": false }
  ]
}
```

**처리 흐름**:
1. 카드 ID 유효성 검증 (3개, 중복 불가)
2. AI 서버 `POST /interpret` 호출 (타임아웃 30초)
3. 결과를 `readings` + `selected_cards` 테이블에 저장
4. 저장된 reading ID 반환

**응답 201**:
```json
{
  "id": 42,
  "concern": "직장을 옮겨야 할지 고민입니다",
  "result": {
    "cards": [
      {
        "position": 1,
        "position_label": "과거",
        "card_name": "The Tower",
        "is_reversed": false,
        "interpretation": "..."
      }
    ],
    "summary": "...",
    "advice": "..."
  },
  "created_at": "2026-05-19T10:00:00"
}
```

**에러**:
- `400` 카드 ID 중복 또는 개수 오류
- `404` 존재하지 않는 카드 ID
- `502` AI 서버 호출 실패
- `504` AI 서버 타임아웃

---

#### GET `/readings`
> 인증 필요

**쿼리 파라미터**:
- `page` (default: 1)
- `limit` (default: 20, max: 50)

**응답 200**:
```json
{
  "total": 15,
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": 42,
      "concern": "직장을 옮겨야 할지...",
      "cards": [
        { "card_id": 16, "name_ko": "탑", "image_url": "...", "is_reversed": false }
      ],
      "created_at": "2026-05-19T10:00:00"
    }
  ]
}
```

---

#### GET `/readings/:id`
> 인증 필요 + 본인 소유 확인

**응답 200**: POST `/readings` 응답과 동일 구조

**에러**:
- `403` 다른 사용자의 리딩 접근
- `404` 존재하지 않는 리딩

---

### Cards

#### GET `/cards`
**응답 200**:
```json
[
  {
    "id": 1,
    "name_ko": "바보",
    "name_en": "The Fool",
    "arcana": "major",
    "image_url": "/static/cards/00_the_fool.jpg"
  }
]
```

#### GET `/cards/:id`
**응답 200**: 단일 카드 상세 (description 포함)

---

## 인증 처리

### JWT 구조
```python
# Access Token payload
{
  "sub": "1",          # user_id
  "type": "access",
  "exp": 1234567890
}

# Refresh Token payload
{
  "sub": "1",
  "type": "refresh",
  "exp": 1234567890
}
```

### 의존성 주입
```python
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    # JWT 검증 → user 반환
    # 실패 시 HTTPException(401)
```

---

## AI 서버 통신

```python
# services/ai_client.py
async def request_interpretation(
    concern: str,
    cards: list[dict]
) -> dict:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{settings.AI_SERVER_URL}/interpret",
            json={"concern": concern, "cards": cards}
        )
        response.raise_for_status()
        return response.json()
```

---

## 환경 변수 (.env)

```env
# DB
DATABASE_URL=mysql+aiomysql://user:password@localhost:3306/arcana

# JWT
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# AI Server
AI_SERVER_URL=http://localhost:8001

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://arcana.app
```

---

## 에러 응답 형식 (공통)

```json
{
  "detail": "에러 메시지",
  "code": "ERROR_CODE"
}
```

| code | 설명 |
|---|---|
| `EMAIL_ALREADY_EXISTS` | 이미 가입된 이메일 |
| `INVALID_CREDENTIALS` | 이메일/비밀번호 불일치 |
| `TOKEN_EXPIRED` | 토큰 만료 |
| `FORBIDDEN` | 권한 없음 |
| `AI_SERVER_ERROR` | AI 서버 연결 실패 |
