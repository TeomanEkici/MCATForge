'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useQuizStore } from '@/store/quiz-store'
import type { Difficulty, SubsectionId } from '@/types'
import { SUBSECTION_LABELS } from '@/lib/utils'

interface Props {
  subsectionId: SubsectionId
  userId: string
}

type QuizCount = 5 | 10 | 20

export function QuizLauncher({ subsectionId, userId }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [count, setCount] = useState<QuizCount>(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setQuiz = useQuizStore((s) => s.setQuiz)
  const router = useRouter()

  async function startQuiz() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subsection: subsectionId, difficulty, count }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to generate quiz')
      }

      const data = await res.json()
      setQuiz(data.questions, subsectionId, difficulty)
      router.push(`/quiz/${subsectionId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6">
        <div>
          <h2 className="font-semibold text-foreground mb-1">Start a Quiz</h2>
          <p className="text-sm text-muted-foreground">
            AI-generated AAMC-style questions for{' '}
            <span className="text-foreground font-medium">{SUBSECTION_LABELS[subsectionId]}</span>
          </p>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize border transition-colors ${
                  difficulty === d
                    ? d === 'easy'
                      ? 'bg-green-600/20 border-green-600 text-green-400'
                      : d === 'medium'
                      ? 'bg-yellow-600/20 border-yellow-600 text-yellow-400'
                      : 'bg-red-600/20 border-red-600 text-red-400'
                    : 'border-border text-muted-foreground hover:bg-secondary'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Number of Questions</label>
          <div className="flex gap-2">
            {([5, 10, 20] as QuizCount[]).map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  count === n
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'border-border text-muted-foreground hover:bg-secondary'
                }`}
              >
                {n} Questions
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          onClick={startQuiz}
          disabled={loading}
          className="bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating questions...
            </>
          ) : (
            'Generate & Start Quiz'
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          Questions are generated fresh by AI each time
        </p>
      </div>
    </div>
  )
}
