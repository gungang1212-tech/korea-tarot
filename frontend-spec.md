# Frontend Spec — 아르카나 (Arcana)

> 버전 1.0 | 기준 기획서: tarot-service-plan.md

---

## 기술 스택

| 항목 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | React 18 + TypeScript | |
| 스타일 | Tailwind CSS | 다크 테마 기본 |
| 상태 관리 | Zustand | 전역: 유저 세션, 리딩 상태 |
| 서버 상태 | TanStack Query v5 | API 캐싱, 로딩/에러 처리 |
| 라우터 | React Router v6 | |
| HTTP 클라이언트 | Axios | JWT 인터셉터 포함 |
| 폼 | React Hook Form + Zod | 유효성 검증 |
| 애니메이션 | Framer Motion | 카드 플립, 페이드 전환 |
| 빌드 | Vite | |

---

## 라우팅 구조

```
/                       홈 (랜딩)
/login                  로그인
/register               회원가입
/reading/new            새 타로 리딩 (3단계 플로우)
/reading/result/:id     리딩 결과 화면
/mypage                 마이페이지 (상담 기록 목록)
/mypage/readings/:id    상담 기록 상세
/cards                  카드 도감 (Phase 2)
```

### 라우트 보호
- 인증 필요 라우트: `/reading/*`, `/mypage/*`
- 미인증 시 `/login`으로 리다이렉트
- 인증된 사용자가 `/login`, `/register` 접근 시 `/`으로 리다이렉트

---

## 페이지 정의

### 1. 홈 (`/`)
**목적**: 서비스 첫인상, 리딩 시작 유도

**구성 요소**:
- 브랜드 로고 + 슬로건
- CTA 버튼: "지금 리딩 시작하기" → `/reading/new`
- 서비스 소개 섹션 (3줄 요약)
- 로그인/회원가입 링크 (비인증 상태일 때)

---

### 2. 로그인 (`/login`)
**구성 요소**:
- 이메일 입력
- 비밀번호 입력
- 로그인 버튼
- 회원가입 링크
- 에러 메시지 (이메일/비밀번호 불일치)

**API 호출**: `POST /auth/login`

**성공 시**: Access Token 저장(메모리) + Refresh Token 저장(httpOnly Cookie) → `/` 리다이렉트

---

### 3. 회원가입 (`/register`)
**구성 요소**:
- 이메일 입력 (중복 확인)
- 닉네임 입력
- 비밀번호 입력
- 비밀번호 확인
- 회원가입 버튼

**유효성 검증**:
- 이메일: 형식 검증
- 비밀번호: 8자 이상, 영문+숫자 조합
- 비밀번호 확인: 일치 여부

**API 호출**: `POST /auth/register`

---

### 4. 새 타로 리딩 (`/reading/new`)
**3단계 스텝 플로우**

#### Step 1 — 고민 입력
- Textarea: 현재 고민 입력 (placeholder: "지금 마음속에 있는 고민을 적어주세요")
- 글자 수 카운터 (최대 200자)
- "카드 선택하기" 버튼 (입력 없으면 비활성)

#### Step 2 — 카드 선택
- 78장 카드 그리드 표시 (뒤집힌 상태)
- 카드 클릭 시: 빛나는 선택 효과 + 포지션 라벨 (1번째 = 과거, 2번째 = 현재, 3번째 = 미래)
- 이미 3장 선택 후 추가 클릭 → 무시 또는 교체 모드
- 선택된 카드 하단 미리보기 표시
- "해석 요청하기" 버튼 (3장 미선택 시 비활성)

#### Step 3 — 로딩
- 전체 화면 신비로운 애니메이션 (별빛 파티클)
- 텍스트: "카드가 당신의 이야기를 읽고 있습니다..."
- API 응답 완료 시 → `/reading/result/:id` 이동

**API 호출**: `POST /readings`

---

### 5. 리딩 결과 (`/reading/result/:id`)
**구성 요소**:
- 헤더: 고민 텍스트 요약
- 카드 섹션 × 3 (각 카드):
  - 카드 이미지 (정/역방향)
  - 포지션 라벨 (과거 / 현재 / 미래)
  - 카드명
  - 해석 텍스트
- 종합 해석 섹션
- 조언 메시지
- "다시 리딩하기" 버튼 → `/reading/new`
- "기록 보러 가기" 버튼 → `/mypage`

**API 호출**: `GET /readings/:id`

---

### 6. 마이페이지 (`/mypage`)
**구성 요소**:
- 유저 닉네임 표시
- 상담 기록 목록 (최신순)
  - 각 항목: 날짜 + 고민 텍스트 앞 50자 + 선택 카드 3개 썸네일
- 페이지네이션 (20개씩)
- 항목 클릭 → `/mypage/readings/:id`

**API 호출**: `GET /readings?page=1&limit=20`

---

### 7. 상담 기록 상세 (`/mypage/readings/:id`)
**구성 요소**: 리딩 결과 화면과 동일 레이아웃
- 상단에 "이 날의 리딩 — YYYY.MM.DD" 날짜 표시
- 수정 불가 (읽기 전용)

**API 호출**: `GET /readings/:id`

---

## 전역 상태 (Zustand)

```typescript
// auth store
interface AuthStore {
  user: { id: number; email: string; nickname: string } | null;
  accessToken: string | null;
  setUser: (user, token) => void;
  logout: () => void;
}

// reading store (리딩 세션 임시 저장)
interface ReadingStore {
  concern: string;
  selectedCards: { cardId: number; position: number; isReversed: boolean }[];
  setConcern: (concern: string) => void;
  addCard: (card) => void;
  removeCard: (cardId: number) => void;
  reset: () => void;
}
```

---

## API 호출 목록

| 화면 | 메서드 | 엔드포인트 | 인증 |
|---|---|---|---|
| 로그인 | POST | `/auth/login` | 불필요 |
| 회원가입 | POST | `/auth/register` | 불필요 |
| 토큰 갱신 | POST | `/auth/refresh` | 불필요 |
| 리딩 요청 | POST | `/readings` | 필요 |
| 리딩 결과 조회 | GET | `/readings/:id` | 필요 |
| 리딩 목록 조회 | GET | `/readings` | 필요 |
| 카드 목록 | GET | `/cards` | 불필요 |

---

## 컴포넌트 목록

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ProtectedRoute.tsx
│   ├── card/
│   │   ├── CardGrid.tsx          # 78장 카드 그리드
│   │   ├── CardItem.tsx          # 개별 카드 (플립 애니메이션)
│   │   └── SelectedCardBar.tsx   # 선택된 카드 하단 미리보기
│   ├── reading/
│   │   ├── ConcernInput.tsx      # Step 1
│   │   ├── CardSelector.tsx      # Step 2
│   │   ├── ReadingLoading.tsx    # Step 3
│   │   └── ReadingResult.tsx     # 결과 화면
│   └── layout/
│       ├── Header.tsx
│       └── PageLayout.tsx
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ReadingNew.tsx
│   ├── ReadingResult.tsx
│   ├── Mypage.tsx
│   └── MypageReadingDetail.tsx
├── stores/
│   ├── authStore.ts
│   └── readingStore.ts
├── hooks/
│   ├── useAuth.ts
│   └── useReading.ts
├── api/
│   ├── client.ts            # Axios 인스턴스 + 인터셉터
│   ├── auth.ts
│   ├── readings.ts
│   └── cards.ts
└── types/
    ├── auth.ts
    ├── reading.ts
    └── card.ts
```

---

## 에러 처리 정책

| 상황 | 처리 방식 |
|---|---|
| 401 Unauthorized | Refresh Token으로 재시도 → 실패 시 로그아웃 |
| 422 Validation Error | 폼 필드 하단에 에러 메시지 표시 |
| 500 Server Error | 토스트 메시지: "일시적인 오류가 발생했습니다" |
| 네트워크 오류 | 토스트 메시지: "인터넷 연결을 확인해주세요" |
| AI 서버 타임아웃 | 로딩 화면에서 "조금 더 기다려주세요..." 메시지 전환 |
