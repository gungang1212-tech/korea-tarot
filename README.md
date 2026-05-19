# Arcana — 타로 AI 상담 서비스

> AI가 당신의 고민을 듣고, 타로 카드의 언어로 답합니다.

---

## 레포 구조

```
arcana/
├── frontend/         # React + TypeScript
├── backend/          # FastAPI + MySQL
├── ai-server/        # FastAPI + LangChain + FAISS
├── specs/            # 서비스 스펙 문서
│   ├── front/
│   ├── backend/
│   └── ai-server/
├── tarot-service-plan.md   # 기획서
└── README.md
```

---

## 서비스 실행 (로컬)

### 1. 백엔드
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # 환경 변수 설정
alembic upgrade head  # DB 마이그레이션
uvicorn app.main:app --reload --port 8000
```

### 2. AI 서버
```bash
cd ai-server
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # OPENAI_API_KEY 설정
python scripts/build_index.py  # FAISS 인덱스 최초 빌드
uvicorn app.main:app --reload --port 8001
```

### 3. 프론트엔드
```bash
cd frontend
npm install
cp .env.example .env
npm run dev  # http://localhost:5173
```

---

## 스펙 문서

| 문서 | 경로 |
|---|---|
| 기획서 | `tarot-service-plan.md` |
| 프론트엔드 스펙 | `specs/front/frontend-spec.md` |
| 백엔드 스펙 | `specs/backend/backend-spec.md` |
| AI 서버 스펙 | `specs/ai-server/ai-server-spec.md` |
