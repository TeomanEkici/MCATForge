import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { QuizResults } from '@/components/quizzes/quiz-results'

interface Props {
  params: Promise<{ id: string }>
}

export default async function QuizResultsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: attempt } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!attempt) notFound()

  return <QuizResults attempt={attempt} />
}
