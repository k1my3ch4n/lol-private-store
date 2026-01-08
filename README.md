# LoL 사설 게임 데이터 아카이브

Next.js를 활용한 LoL 게임 결과 이미지 데이터 추출 및 아카이브 시스템

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | 16.1.1 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | latest |
| Database | PostgreSQL (Docker) | 16-alpine |
| DB Driver | pg (node-postgres) | latest |
| AI API | Google Gemini | - |

---

## 개발 진행 상황

### Phase 1: 프로젝트 초기 설정 ✅

| 항목 | 상태 | 설명 |
|------|:----:|------|
| Next.js 프로젝트 생성 | ✅ | TypeScript + Tailwind CSS + App Router |
| shadcn/ui 설정 | ✅ | button, input, table, card, select 컴포넌트 |
| Docker Compose | ✅ | PostgreSQL 16 컨테이너 설정 |
| pg 설정 | ✅ | node-postgres 연결 및 쿼리 헬퍼 함수 작성 |
| 환경변수 설정 | ✅ | DATABASE_URL, GEMINI_API_KEY |

### Phase 2: 이미지 업로드 기능 ✅

| 항목 | 상태 | 설명 |
|------|:----:|------|
| 이미지 업로드 UI | ✅ | 드래그 앤 드롭 + 파일 선택 |
| 이미지 미리보기 | ✅ | 업로드된 이미지 프리뷰 |
| 업로드 API | ✅ | /api/upload (Base64 변환 포함) |

### Phase 3: Gemini API 연동 ✅

| 항목 | 상태 | 설명 |
|------|:----:|------|
| Gemini API 클라이언트 | ✅ | gemini.ts 구현 완료 |
| 이미지 분석 프롬프트 | ✅ | prompts.ts 구현 완료 |
| 데이터 추출 API | ✅ | /api/extract 구현 완료 |

### Phase 4: 데이터 검토/수정 UI ✅

| 항목 | 상태 | 설명 |
|------|:----:|------|
| 추출 데이터 테이블 | ✅ | DataTable.tsx 구현 완료 |
| 인라인 수정 기능 | ✅ | 각 필드 직접 수정 가능 |
| 승/패 선택 UI | ✅ | Select 컴포넌트 활용 |
| 저장 버튼 | ✅ | 메인 페이지에 구현 |

### Phase 5: 데이터 저장 ✅

| 항목 | 상태 | 설명 |
|------|:----:|------|
| 게임 데이터 저장 API | ✅ | /api/save 구현 완료 |
| pg를 통한 DB 저장 | ✅ | 트랜잭션 처리 포함 |
| 저장 성공/실패 피드백 | ✅ | UI 피드백 구현 |

### Phase 6: 추후 진행 예정

---

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env` 파일 생성:

```env
# Database (Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lol_archive?schema=public"

# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. Docker PostgreSQL 실행 (선택)

```bash
docker-compose up -d
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

---

## 프로젝트 구조

```
lol-private-store/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI
├── src/
│   ├── app/
│   │   ├── page.tsx           # 메인 페이지 (업로드 + 데이터 편집)
│   │   └── api/
│   │       ├── upload/route.ts  # 업로드 API
│   │       ├── extract/route.ts # Gemini 데이터 추출 API
│   │       └── save/route.ts    # DB 저장 API
│   ├── components/
│   │   ├── ui/                # shadcn/ui 컴포넌트
│   │   ├── ImageUploader.tsx  # 드래그앤드롭 업로더
│   │   ├── ImagePreview.tsx   # 이미지 미리보기
│   │   └── DataTable.tsx      # 추출 데이터 테이블
│   └── lib/
│       ├── db.ts              # pg 연결 및 쿼리 헬퍼
│       ├── gemini.ts          # Gemini API 클라이언트
│       ├── prompts.ts         # 이미지 분석 프롬프트
│       ├── types.ts           # TypeScript 타입 정의
│       └── utils.ts           # 유틸리티 함수
├── docker-compose.yml         # PostgreSQL 설정
├── .env                       # 환경변수 (git 제외)
├── .env.example               # 환경변수 템플릿
└── plan.md                    # 구현 계획
```

---

## 데이터 구조

### Game (경기)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | Int | PK |
| gameTime | String | 게임 시간 (예: "27:17") |
| result | String | 승/패 |
| createdAt | DateTime | 생성일시 |

### Player (플레이어)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | Int | PK |
| gameId | Int | FK → Game |
| team | Int | 1 또는 2 |
| lane | String | 탑/정글/미드/원딜/서폿 |
| level | Int | 레벨 |
| champion | String | 챔피언명 |
| summonerName | String | 소환사명 |
| spell1, spell2 | String | 스펠 |
| kills, deaths, assists | Int | K/D/A |
| kda | Float? | KDA 수치 |
| damage | Int | 피해량 |
| gold | Int | 골드 |
| vision | Int? | 시야점수 |

---

## shadcn/ui

### shadcn/ui란?

[shadcn/ui](https://ui.shadcn.com/)는 Re-usable 컴포넌트 컬렉션으로, npm 패키지가 아닌 **소스 코드를 직접 프로젝트에 복사**하는 방식을 사용한다.

### 사용 이유

1. **완전한 소유권**: 컴포넌트 코드를 자유롭게 수정 가능
2. **의존성 최소화**: 외부 패키지 버전 업데이트로 인한 breaking change 없음
3. **Tailwind CSS 기반**: 일관된 스타일링
4. **접근성(A11y)**: Radix UI 기반으로 접근성 내장
5. **TypeScript 지원**: 완벽한 타입 지원

### 장단점

| 장점 | 단점 |
|------|------|
| 커스터마이징 자유도 100% | 업데이트 수동 관리 필요 |
| 번들 사이즈 최적화 | 초기 학습 곡선 |
| 컴포넌트 내부 구현 학습 가능 | 코드량 증가 |

### 컴포넌트 추가 방법

```bash
npx shadcn@latest add [컴포넌트명]
```

---

## pg (node-postgres) 사용법

### 연결 및 쿼리

```typescript
// src/lib/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 쿼리 헬퍼 함수
export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

// 단일 결과 헬퍼 함수
export async function queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const result = await pool.query(text, params);
  return (result.rows[0] as T) ?? null;
}
```

---

## 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```
