'use client'

import Link from 'next/link'
import { useQuizStore } from '@/store/quiz-store'
import { scoreToPercent, SUBSECTION_LABELS } from '@/lib/utils'
import type { SubsectionId } from '@/types'
import { CheckCircle, XCircle, RotateCcw, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  attempt: {
    subsection: string
    score: number
    total: number
    difficulty: string
    completed_at: string
  }
}

export function QuizResults({ attempt }: Props) {
  const { questions, answers, resetQuiz } = useQuizStore()
  const pct = scoreToPercent(attempt.score, attempt.total)
  const subsectionLabel = SUBSECTION_LABELS[attempt.subsection as SubsectionId] ?? attempt.subsection

  const grade =
    pct >= 90 ? { label: 'Excellent!', color: 'text-green-400' } :
    pct >= 75 ? { label: 'Good job!', color: 'text-blue-400' } :
    pct >= 60 ? { label: 'Keep studying', color: 'text-yellow-400' } :
    { label: 'Needs work', color: 'text-red-400' }

  return (
    <div className="min-h-screen bg-background p-6 max-w-3xl mx-auto">
      {/* Score header */}
      <div className="bg-card border border-border rounded-xl p-8 text-center mb-6">
        <p className="text-muted-foreground text-sm mb-2">{subsectionLabel} · {attempt.difficulty}</p>
        <div className={cn('text-6xl font-bold mb-2', grade.color)}>{pct}%</div>
        <p className={cn('text-xl font-semibold mb-1', grade.color)}>{grade.label}</p>
        <p className="text-muted-foreground">
          {attempt.score} / {attempt.total} correct
        </p>
      </div>

      {/* Question review */}
      {questions.length > 0 && (
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="font-semibold text-foreground">Question Review</h2>
          {questions.map((q, i) => {
            const userAnswer = answers[q.id]
            const isCorrect = userAnswer === q.correct_answer
            return (
              <div key={q.id} className={cn('bg-card border rounded-xl p-5', isCorrect ? 'border-green-600/40' : 'border-red-600/40')}>
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-foreground text-sm font-medium leading-relaxed">{i + 1}. {q.prompt}</p>
                </div>

                <div className="ml-8 flex flex-col gap-1.5 mb-3">
                  {q.options.map((opt, j) => (
                    <div
                      key={j}
                      className={cn(
                        'text-sm px-3 py-1.5 rounded-lg',
                        j === q.correct_answer && 'bg-green-600/10 text-green-400 font-medium',
                        j === userAnswer && j !== q.correct_answer && 'bg-red-600/10 text-red-400 line-through',
                        j !== q.correct_answer && j !== userAnswer && 'text-muted-foreground'
                      )}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + j)}.</span>
                      {opt}
                    </div>
                  ))}
                </div>

                <div className="ml-8 bg-background rounded-lg px-3 py-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Explanation</p>
                  <p className="text-sm text-foreground leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/dashboard"
          onClick={resetQuiz}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm font-medium"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href={`/study/${attempt.subsection.includes('passage') || attempt.subsection.includes('reading') || attempt.subsection.includes('logic') ? 'cars' : attempt.subsection.includes('psych') || attempt.subsection.includes('soci') || attempt.subsection.includes('behav') ? 'psych-soc' : attempt.subsection.includes('chem') || attempt.subsection.includes('phys') || attempt.subsection.includes('thermo') || attempt.subsection.includes('electro') ? 'chem-phys' : 'bio-biochem'}/${attempt.subsection}`}
          onClick={resetQuiz}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="h-4 w-4" />
          Study Again
        </Link>
      </div>
    </div>
  )
}
