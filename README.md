# LoL 사설 게임 데이터 아카이브

Next.js를 활용한 LoL 게임 결과 이미지 데이터 추출 및 아카이브 시스템

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (Docker)
- **ORM**: Prisma
- **AI API**: Google Gemini

---

## shadcn/ui

### shadcn/ui란?

[shadcn/ui](https://ui.shadcn.com/)는 Re-usable 컴포넌트 컬렉션으로, 전통적인 UI 라이브러리와 다르게 **npm 패키지로 설치하지 않고 소스 코드를 직접 프로젝트에 복사**하는 방식을 사용한다.

### 왜 shadcn/ui를 사용하는가?

1. **완전한 소유권**: 컴포넌트 코드가 프로젝트에 직접 존재하므로 자유롭게 수정 가능
2. **의존성 최소화**: 외부 패키지 버전 업데이트로 인한 breaking change 걱정 없음
3. **Tailwind CSS 기반**: Tailwind와 완벽하게 통합되어 일관된 스타일링 가능
4. **접근성(A11y)**: Radix UI 기반으로 접근성이 기본 내장됨
5. **TypeScript 지원**: 완벽한 타입 지원

### 장점

| 장점 | 설명 |
|------|------|
| 커스터마이징 자유도 | 코드가 내 프로젝트에 있으므로 100% 수정 가능 |
| 번들 사이즈 최적화 | 필요한 컴포넌트만 선택적으로 추가 |
| 학습 용이성 | 컴포넌트 내부 구현을 직접 볼 수 있음 |
| 디자인 시스템 구축 | 기본 컴포넌트를 기반으로 확장 가능 |
| 최신 트렌드 | Tailwind v4, React 19 등 최신 기술 빠르게 지원 |

### 단점

| 단점 | 설명 |
|------|------|
| 업데이트 수동 관리 | 새 버전이 나와도 자동 업데이트 안됨 (직접 코드 수정 필요) |
| 초기 학습 곡선 | Radix UI, Tailwind 개념 이해 필요 |
| 코드 양 증가 | 컴포넌트 소스가 프로젝트에 포함되어 코드량 증가 |

### 설치된 컴포넌트

```
src/components/ui/
├── button.tsx    # 버튼
├── input.tsx     # 입력 필드
├── table.tsx     # 테이블
├── card.tsx      # 카드 레이아웃
└── select.tsx    # 드롭다운 선택
```

### 컴포넌트 추가 방법

```bash
npx shadcn@latest add [컴포넌트명]

# 예시
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

---

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인

---

## 프로젝트 구조

```
lol-private-store/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React 컴포넌트
│   │   └── ui/        # shadcn/ui 컴포넌트
│   └── lib/           # 유틸리티 함수
├── prisma/            # Prisma 스키마
├── public/            # 정적 파일
└── docker-compose.yml # PostgreSQL 설정
```
