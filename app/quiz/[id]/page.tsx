'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz-store'
import { QuizEngine } from '@/components/quizzes/quiz-engine'

export default function QuizPage() {
  const { questions, subsection } = useQuizStore()
  const router = useRouter()

  useEffect(() => {
    if (questions.length === 0) {
      router.replace('/dashboard')
    }
  }, [questions, router])

  if (questions.length === 0) return null

  return <QuizEngine />
}
