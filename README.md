# Arcana — 타로 AI 상담 서비스

> AI가 당신의 고민을 듣고, 타로 카드의 언어로 답합니다.

---

## 레포 구조

```
arcana/
├── frontend/            # React 18 + TypeScript + Tailwind CSS
├── backend/             # FastAPI + SQLAlchemy + MySQL
├── ai-server/           # FastAPI + LangChain + FAISS + OpenAI
├── docker-compose.yml
├── init.sql
├── .env.example
├── tarot-service-plan.md
├── backend-spec.md
├── frontend-spec.md
└── ai-server-spec.md
```

---

## 빠른 시작 (Docker)

```bash
cp .env.example .env
# .env에 OPENAI_API_KEY 입력

docker-compose up --build
```

- 프론트엔드: http://localhost:3000
- 백엔드 API Docs: http://localhost:8000/docs
- AI 서버 Docs: http://localhost:8001/docs

---

## 로컬 개발 환경

### 1. MySQL

```bash
docker-compose up mysql -d
```

### 2. 백엔드

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env    # DATABASE_URL, SECRET_KEY 설정
uvicorn app.main:app --reload --port 8000
```

### 3. AI 서버

```bash
cd ai-server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env    # OPENAI_API_KEY 설정
python scripts/build_index.py   # FAISS 인덱스 최초 빌드 (1회)
uvicorn app.main:app --reload --port 8001
```

### 4. 프론트엔드

```bash
cd frontend
npm install
cp .env.example .env
npm run dev  # http://localhost:5173
```

---

## 환경 변수

| 변수 | 설명 |
|---|---|
| `OPENAI_API_KEY` | OpenAI API 키 (필수) |
| `SECRET_KEY` | JWT 서명 키 |
| `MYSQL_PASSWORD` | MySQL 비밀번호 |

---

## 주요 기능 (MVP)

- **회원가입 / 로그인** — JWT (Access 30분 + Refresh 7일 httpOnly Cookie)
- **타로 리딩** — 고민 입력 → 78장 중 3장 선택 → AI 해석
- **RAG 해석** — FAISS + LangChain으로 카드 설명 검색 후 GPT-4o로 해석 생성
- **상담 기록** — MySQL 저장, 마이페이지에서 재조회

---

*본 서비스는 오락·자기탐색 목적입니다*
