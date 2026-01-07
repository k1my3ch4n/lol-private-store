# LoL 사설 게임 데이터 아카이브 - 구현 계획

## 개요
Next.js를 활용하여 LoL 게임 결과 이미지에서 데이터를 추출하고, 저장/조회하는 웹 애플리케이션

## 기술 스택
| 영역 | 기술 |
|------|------|
| Frontend/Backend | Next.js 14 (App Router) |
| AI API | Google Gemini API |
| Database | PostgreSQL (Docker) |
| ORM | Prisma |
| UI | Tailwind CSS + shadcn/ui |
| 배포 | GCP (추후) |

---

## 데이터 구조

### Game (경기)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Int | PK, Auto Increment |
| gameTime | String | 게임 시간 (예: "27:17") |
| result | String | 승/패 |
| createdAt | DateTime | 생성일시 |

### Player (플레이어) - 경기당 10명
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Int | PK, Auto Increment |
| gameId | Int | FK → Game |
| team | Int | 1 또는 2 (추후: 아군/적군 구분 추가 예정) |
| lane | String | 탑/정글/미드/원딜/서폿 |
| level | Int | 레벨 |
| champion | String | 챔피언명 |
| summonerName | String | 소환사명 |
| spell1 | String | 스펠1 |
| spell2 | String | 스펠2 |
| kills | Int | 킬 |
| deaths | Int | 데스 |
| assists | Int | 어시스트 |
| kda | Float | KDA (nullable) |
| damage | Int | 피해량 |
| gold | Int | 골드 |
| vision | Int | 시야점수 (nullable) |

---

## 구현 단계

### Phase 1: 프로젝트 초기 설정
- [x] Next.js 프로젝트 생성
- [x] Tailwind CSS + shadcn/ui 설정
- [ ] Docker Compose로 PostgreSQL 설정
- [ ] Prisma 설정 및 스키마 작성
- [ ] 환경변수 설정 (.env)

### Phase 2: 이미지 업로드 기능
- [ ] 이미지 업로드 UI 컴포넌트
- [ ] 이미지 미리보기 기능
- [ ] 업로드 API 엔드포인트 (/api/upload)

### Phase 3: Gemini API 연동
- [ ] Gemini API 클라이언트 설정
- [ ] 이미지 분석 프롬프트 작성
- [ ] 데이터 추출 API (/api/extract)
- [ ] 추출 결과 파싱 로직

### Phase 4: 데이터 검토/수정 UI
- [ ] 추출된 데이터 테이블 표시
- [ ] 인라인 수정 기능
- [ ] 승/패 선택 UI
- [ ] 저장 버튼

### Phase 5: 데이터 저장
- [ ] 게임 데이터 저장 API (/api/games)
- [ ] Prisma를 통한 DB 저장
- [ ] 저장 성공/실패 피드백

### Phase 6: 데이터 조회 + 필터링
- [ ] 게임 목록 페이지
- [ ] 필터링 UI (챔피언, 라인, 승/패, 소환사명)
- [ ] 상세 보기 모달/페이지
- [ ] 페이지네이션

---

## 폴더 구조

```
lol-private-store/
├── docker-compose.yml
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── page.tsx              # 메인 (업로드)
│   │   ├── games/
│   │   │   └── page.tsx          # 게임 목록
│   │   └── api/
│   │       ├── upload/route.ts
│   │       ├── extract/route.ts
│   │       └── games/route.ts
│   ├── components/
│   │   ├── ImageUploader.tsx
│   │   ├── DataTable.tsx
│   │   ├── GameList.tsx
│   │   └── FilterPanel.tsx
│   └── lib/
│       ├── gemini.ts
│       ├── prisma.ts
│       └── types.ts
└── .env
```

---

## 진행 순서

**Phase 1** → **Phase 2** → **Phase 3** → **Phase 4** → **Phase 5** → **Phase 6**

각 Phase 완료 후 동작 확인하며 진행
