import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getSubsectionById } from '@/lib/mcat-taxonomy'
import { StudyWorkspace } from '@/components/study/study-workspace'
import type { SubsectionId } from '@/types'

interface Props {
  params: Promise<{ section: string; subsection: string }>
}

export default async function StudyPage({ params }: Props) {
  const { section, subsection } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const found = getSubsectionById(subsection)
  if (!found || found.section.id !== section) notFound()

  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('*')
    .eq('subsection', subsection)
    .order('created_at')

  const { data: userReviewsRaw } = await supabase
    .from('flashcard_reviews')
    .select('flashcard_id, difficulty, next_review')
    .eq('user_id', user.id)

  const userReviews = (userReviewsRaw ?? []) as Array<{
    flashcard_id: string
    difficulty: string
    next_review: string
  }>

  const reviewMap = Object.fromEntries(
    userReviews.map((r) => [r.flashcard_id, { difficulty: r.difficulty, next_review: r.next_review }])
  )

  const { data: progress } = await supabase
    .from('progress_metrics')
    .select('*')
    .eq('user_id', user.id)
    .eq('subsection', subsection)
    .single()

  return (
    <StudyWorkspace
      userId={user.id}
      section={found.section}
      subsection={found.subsection}
      flashcards={flashcards ?? []}
      reviewMap={reviewMap}
      progress={progress}
      subsectionId={subsection as SubsectionId}
    />
  )
}
