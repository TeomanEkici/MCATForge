# MCAT Forge

AI-powered MCAT study platform with subsection-specific quizzes and spaced-repetition flashcards.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth
- **AI**: OpenAI GPT-4o
- **State**: Zustand
- **Deployment**: Vercel

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (secret) |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |

### 3. Set up the database

In your Supabase project SQL editor, run the migrations in order:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rpc_functions.sql
```

Or use the Supabase CLI:

```bash
supabase db push
```

### 4. Seed the database

```bash
npm run seed
```

This populates flashcards for all 16 subsections and sample quiz questions.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Authentication** — Sign up, login, logout via Supabase Auth
- **Dashboard** — Progress overview, section bars, recent scores, radar chart
- **Flashcards** — Spaced repetition (Easy=7d, Medium=3d, Hard=1d), flip animation
- **Quiz Engine** — GPT-4o generates fresh AAMC-style questions per subsection
- **Progress Tracking** — Quiz accuracy and flashcard counts persisted per user
- **Settings** — Password change, account info

## Project Structure

```
app/
  page.tsx                    # Landing page
  dashboard/page.tsx          # Main dashboard
  study/[section]/[subsection]/page.tsx  # Study workspace
  quiz/[id]/page.tsx          # Active quiz
  quiz/results/[id]/page.tsx  # Quiz results
  auth/{login,signup}/        # Auth pages
  settings/page.tsx           # Settings
  api/
    generate-quiz/route.ts    # AI quiz generation
    flashcards/route.ts       # Flashcard API
    progress/route.ts         # Progress API

components/
  dashboard/                  # Sidebar, dashboard cards, progress bar
  flashcards/                 # Flashcard deck, card view
  quizzes/                    # Quiz launcher, engine, results
  settings/                   # Settings form

lib/
  supabase/{client,server,middleware}.ts
  openai/client.ts
  mcat-taxonomy.ts            # Section/subsection definitions
  utils.ts

store/
  quiz-store.ts               # Zustand quiz state
  flashcard-store.ts          # Zustand flashcard state

types/
  index.ts                    # Domain types
  database.ts                 # Supabase schema types

scripts/seed.ts               # Database seeder
supabase/migrations/          # SQL migrations
```

## Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables from `.env.local`
4. Deploy

## MCAT Sections

| Section | Subsections |
|---|---|
| Bio/Biochem | Biochemistry, Molecular Biology, Genetics, Metabolism, Cell Biology |
| Chem/Phys | General Chemistry, Organic Chemistry, Physics, Thermodynamics, Electrochemistry |
| Psych/Soc | Psychology, Sociology, Behavioral Science |
| CARS | Passage Analysis, Reading Comprehension, Logic & Reasoning |
