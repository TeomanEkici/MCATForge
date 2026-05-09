'use client'

import { useQuizStore } from '@/store/quiz-store'
import { QuizResults } from '@/components/quizzes/quiz-results'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LocalResultsPage() {
  const { questions, subsection, difficulty, resetQuiz } = useQuizStore()
  const router = useRouter()

  useEffect(() => {
    if (questions.length === 0) router.replace('/dashboard')
  }, [questions, router])

  if (questions.length === 0) return null

  const { answers } = useQuizStore.getState()
  const score = questions.filter((q) => answers[q.id] === q.correct_answer).length

  return (
    <QuizResults
      attempt={{
        subsection: subsection ?? '',
        score,
        total: questions.length,
        difficulty: difficulty ?? 'medium',
        completed_at: new Date().toISOString(),
      }}
    />
  )
}
