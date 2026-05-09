-- Increment flashcards_reviewed in progress_metrics safely
create or replace function increment_flashcards_reviewed(
  p_user_id uuid,
  p_subsection text
)
returns void
language plpgsql
security definer
as $$
begin
  insert into progress_metrics (user_id, subsection, flashcards_reviewed, updated_at)
  values (p_user_id, p_subsection, 1, now())
  on conflict (user_id, subsection)
  do update set
    flashcards_reviewed = progress_metrics.flashcards_reviewed + 1,
    updated_at = now();
end;
$$;
