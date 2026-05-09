-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Sections
create table if not exists sections (
  id text primary key,
  name text not null,
  short_name text not null,
  order_index integer not null
);

-- Subsections
create table if not exists subsections (
  id text primary key,
  section_id text not null references sections(id) on delete cascade,
  name text not null,
  order_index integer not null
);

-- Flashcards
create table if not exists flashcards (
  id uuid primary key default uuid_generate_v4(),
  section text not null references sections(id),
  subsection text not null references subsections(id),
  front text not null,
  back text not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  next_review timestamptz,
  created_at timestamptz default now()
);

-- Flashcard Reviews (per-user scheduling)
create table if not exists flashcard_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  flashcard_id uuid not null references flashcards(id) on delete cascade,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  reviewed_at timestamptz default now(),
  next_review timestamptz not null,
  unique(user_id, flashcard_id)
);

-- Quiz Questions
create table if not exists quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  prompt text not null,
  options jsonb not null,
  correct_answer integer not null,
  explanation text not null,
  subsection text not null references subsections(id),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz default now()
);

-- Quiz Attempts
create table if not exists quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subsection text not null references subsections(id),
  score integer not null,
  total integer not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  answers jsonb not null default '{}',
  completed_at timestamptz default now()
);

-- Progress Metrics
create table if not exists progress_metrics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subsection text not null references subsections(id),
  flashcards_reviewed integer default 0,
  quiz_accuracy numeric(5,2) default 0,
  time_spent_minutes integer default 0,
  updated_at timestamptz default now(),
  unique(user_id, subsection)
);

-- Row Level Security
alter table flashcard_reviews enable row level security;
alter table quiz_attempts enable row level security;
alter table progress_metrics enable row level security;

-- Policies: users can only access their own data
create policy "Users can read own flashcard reviews"
  on flashcard_reviews for select using (auth.uid() = user_id);

create policy "Users can insert own flashcard reviews"
  on flashcard_reviews for insert with check (auth.uid() = user_id);

create policy "Users can update own flashcard reviews"
  on flashcard_reviews for update using (auth.uid() = user_id);

create policy "Users can read own quiz attempts"
  on quiz_attempts for select using (auth.uid() = user_id);

create policy "Users can insert own quiz attempts"
  on quiz_attempts for insert with check (auth.uid() = user_id);

create policy "Users can read own progress"
  on progress_metrics for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on progress_metrics for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on progress_metrics for update using (auth.uid() = user_id);

-- Public read for shared content
alter table sections enable row level security;
alter table subsections enable row level security;
alter table flashcards enable row level security;
alter table quiz_questions enable row level security;

create policy "Public read sections" on sections for select using (true);
create policy "Public read subsections" on subsections for select using (true);
create policy "Public read flashcards" on flashcards for select using (true);
create policy "Public read quiz questions" on quiz_questions for select using (true);
