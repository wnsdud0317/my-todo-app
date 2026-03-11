# My Todo App

Next.js + Supabase로 만든 할 일 관리 웹앱입니다.

## 기능

- 할 일 추가 (입력창 또는 Enter 키)
- 완료 체크 (체크박스 클릭 시 취소선 표시)
- 할 일 삭제
- 새로고침 후 데이터 유지 (Supabase DB 연동)

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 데이터베이스 | Supabase (PostgreSQL) |
| 배포 | Vercel |

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 Supabase 프로젝트 정보를 입력합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

### 3. Supabase 테이블 생성

Supabase 대시보드 또는 SQL Editor에서 아래 쿼리를 실행합니다.

```sql
CREATE TABLE todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:4567](http://localhost:4567)로 접속합니다.

## 프로젝트 구조

```
my-todo-app/
├── app/
│   ├── page.tsx       # 메인 Todo 페이지 (UI + CRUD)
│   ├── layout.tsx     # 루트 레이아웃
│   └── globals.css    # 전역 스타일
├── lib/
│   └── supabase.ts    # Supabase 클라이언트
└── .env.local         # 환경변수 (git 제외)
```
