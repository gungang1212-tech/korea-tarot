# AI Server Spec — 아르카나 (Arcana)

> 버전 1.0 | 기준 기획서: tarot-service-plan.md

---

## 역할

백엔드 API 서버로부터 해석 요청을 받아 RAG 기반으로 타로 카드 해석 결과를 생성하여 반환한다.

---

## 기술 스택

| 항목 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | FastAPI (Python 3.11+) | |
| LLM | GPT-4o (OpenAI) | 또는 Claude Sonnet 교체 가능 |
| RAG 프레임워크 | LangChain | |
| 벡터 DB | FAISS | 로컬 파일 저장 방식 |
| 임베딩 | OpenAI text-embedding-3-small | |
| 문서 로더 | LangChain DirectoryLoader + TextLoader | |
| 환경 변수 | python-dotenv | |

---

## 프로젝트 구조

```
ai-server/
├── app/
│   ├── main.py              # FastAPI 앱 진입점
│   ├── config.py            # 환경 변수
│   ├── routers/
│   │   └── interpret.py     # /interpret 엔드포인트
│   ├── services/
│   │   ├── rag_service.py   # FAISS 검색 + 프롬프트 구성
│   │   └── llm_service.py   # LLM 호출
│   └── data/
│       └── loader.py        # 문서 로딩 및 FAISS 인덱스 빌드
├── data/
│   └── cards/               # 카드 설명 문서 (텍스트 파일)
│       ├── major/
│       │   ├── 00_the_fool.txt
│       │   ├── 01_the_magician.txt
│       │   └── ...          # 22장
│       └── minor/
│           └── ...          # 56장
├── faiss_index/             # 빌드된 FAISS 인덱스 저장 위치
├── scripts/
│   └── build_index.py       # 인덱스 최초 빌드 스크립트
├── .env
└── requirements.txt
```

---

## 카드 문서 형식

각 카드별 `.txt` 파일 구조:

```
# The Tower (탑) — Major Arcana 16

## 키워드
급격한 변화, 붕괴, 각성, 해방, 충격, 진실

## 정방향 의미
탑 카드는 갑작스럽고 불가피한 변화를 상징합니다.
쌓아 올린 구조물이 무너지듯, 오래된 믿음이나 상황이
급격히 해체되는 시기를 나타냅니다.
이는 고통스럽지만, 더 진실된 것을 위한 공간을 만드는 과정입니다.

## 역방향 의미
변화에 저항하거나 충격을 내면화하고 있음을 나타냅니다.
피할 수 없는 변화를 억지로 막으려 하는 상황일 수 있습니다.

## 연애/관계
관계의 근본적인 재정의. 거짓 위에 세워진 관계의 붕괴.

## 직업/커리어
예상치 못한 직업 변화, 구조조정, 전환점.

## 과거 포지션
과거의 급격한 변화가 현재 상황의 뿌리가 되었음.

## 현재 포지션
지금 이 순간 충격적인 변화 또는 깨달음의 한가운데 있음.

## 미래 포지션
앞으로 큰 변화가 찾아올 것. 저항보다 수용이 현명함.
```

---

## API 엔드포인트

### POST `/interpret`
**요청 (백엔드 → AI 서버)**:
```json
{
  "concern": "직장을 옮겨야 할지 고민입니다",
  "cards": [
    {
      "card_id": 16,
      "name_en": "The Tower",
      "name_ko": "탑",
      "position": 1,
      "position_label": "과거",
      "is_reversed": false
    },
    {
      "card_id": 7,
      "name_en": "The Chariot",
      "name_ko": "전차",
      "position": 2,
      "position_label": "현재",
      "is_reversed": false
    },
    {
      "card_id": 17,
      "name_en": "The Star",
      "name_ko": "별",
      "position": 3,
      "position_label": "미래",
      "is_reversed": false
    }
  ]
}
```

**응답 200**:
```json
{
  "cards": [
    {
      "position": 1,
      "position_label": "과거",
      "card_name_ko": "탑",
      "card_name_en": "The Tower",
      "is_reversed": false,
      "interpretation": "과거에 겪은 급격한 변화나 예상치 못한 붕괴가..."
    },
    {
      "position": 2,
      "position_label": "현재",
      "card_name_ko": "전차",
      "card_name_en": "The Chariot",
      "is_reversed": false,
      "interpretation": "현재 당신은 강한 의지와 추진력으로..."
    },
    {
      "position": 3,
      "position_label": "미래",
      "card_name_ko": "별",
      "card_name_en": "The Star",
      "is_reversed": false,
      "interpretation": "앞으로의 방향은 희망과 치유의 빛을 향해..."
    }
  ],
  "summary": "과거의 변화가 현재의 추진력을 만들었고, 그 길의 끝에는 희망이 기다리고 있습니다...",
  "advice": "두려움보다 가능성에 집중하세요. 당신이 걷는 길은 이미 시작되었습니다."
}
```

---

## RAG 파이프라인

### 1. 인덱스 빌드 (`build_index.py`)
```python
# 최초 1회 또는 문서 업데이트 시 실행
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

loader = DirectoryLoader("data/cards/", glob="**/*.txt", loader_cls=TextLoader)
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = FAISS.from_documents(chunks, embeddings)
vectorstore.save_local("faiss_index/")
```

### 2. 검색 및 해석 (`rag_service.py`)
```python
async def build_context(card_name_en: str, position_label: str) -> str:
    vectorstore = FAISS.load_local("faiss_index/", embeddings)
    query = f"{card_name_en} {position_label} tarot meaning"
    docs = vectorstore.similarity_search(query, k=3)
    return "\n\n".join([doc.page_content for doc in docs])
```

### 3. 프롬프트 구성
```python
SYSTEM_PROMPT = """
당신은 20년 경력의 타로 리더입니다.
사용자의 고민에 진심으로 귀 기울이고, 카드가 전하는 상징적 메시지를
따뜻하고 통찰력 있게 전달하세요.
단정 짓지 말고, 가능성을 열어두는 방식으로 이야기하세요.
해석은 200자 내외로 작성하세요.
"""

def build_prompt(concern: str, card: dict, context: str) -> str:
    return f"""
[카드 정보]
{context}

[고민]
{concern}

[요청]
위 카드({card['name_ko']} / {card['position_label']} 포지션, {'역방향' if card['is_reversed'] else '정방향'})가
이 고민에 전하는 메시지를 해석해주세요.
"""
```

---

## LLM 호출 흐름

```
요청 수신
    ↓
카드 3장에 대해 병렬로 FAISS 검색 (asyncio.gather)
    ↓
각 카드별 프롬프트 구성
    ↓
카드별 LLM 호출 (병렬)
    ↓
종합 해석 + 조언 LLM 호출 (카드 3개 해석 결과 입력)
    ↓
응답 조합 및 반환
```

### 병렬 처리 예시
```python
async def interpret(request: InterpretRequest) -> InterpretResponse:
    # 카드 3장 병렬 해석
    tasks = [interpret_single_card(request.concern, card) for card in request.cards]
    card_results = await asyncio.gather(*tasks)

    # 종합 해석
    summary, advice = await generate_summary(request.concern, card_results)

    return InterpretResponse(cards=card_results, summary=summary, advice=advice)
```

---

## 환경 변수 (.env)

```env
OPENAI_API_KEY=sk-...
FAISS_INDEX_PATH=faiss_index/
EMBEDDING_MODEL=text-embedding-3-small
LLM_MODEL=gpt-4o
LLM_MAX_TOKENS=500
```

---

## 성능 고려 사항

| 항목 | 목표 | 방법 |
|---|---|---|
| 응답 시간 | 10초 이내 | 카드 해석 병렬 처리 |
| FAISS 로딩 | 서버 시작 시 1회 | 전역 싱글턴 인스턴스 |
| 토큰 절약 | 카드당 500토큰 이하 | chunk_size, max_tokens 제한 |
| 타임아웃 | 30초 | 백엔드에서 설정 |
