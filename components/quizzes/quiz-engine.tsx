'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react'
import { useQuizStore } from '@/store/quiz-store'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export function QuizEngine() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const {
    questions,
    currentIndex,
    answers,
    subsection,
    difficulty,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    submitQuiz,
  } = useQuizStore()

  const current = questions[currentIndex]
  const selectedAnswer = current ? answers[current.id] : undefined
  const isLast = currentIndex === questions.length - 1
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    submitQuiz()

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user || !subsection || !difficulty) {
        // Still show results even without persistence
        router.push('/quiz/results/local')
        return
      }

      const score = questions.filter((q) => answers[q.id] === q.correct_answer).length

      const { data: attempt, error: insertError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          subsection,
          score,
          total: questions.length,
          difficulty,
          answers,
        })
        .select()
        .single()

      if (insertError) {
        console.error('DB insert error:', insertError.message)
        // Navigate anyway so user can see results
        router.push('/quiz/results/local')
        return
      }

      const accuracy = Math.round((score / questions.length) * 100)
      await supabase.from('progress_metrics').upsert(
        { user_id: user.id, subsection, quiz_accuracy: accuracy, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,subsection', ignoreDuplicates: false }
      )

      router.push(`/quiz/results/${attempt.id}`)
    } catch (e) {
      console.error('Submit error:', e)
      router.push('/quiz/results/local')
    }
  }

  if (!current) return null

  return (
    <div className="min-h-screen bg-background p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-muted-foreground capitalize">
            {subsection?.replace(/-/g, ' ')} · {difficulty}
          </p>
          <p className="text-foreground font-medium">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="flex gap-1">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => useQuizStore.setState({ currentIndex: i })}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-colors',
                i === currentIndex
                  ? 'bg-primary'
                  : answers[q.id] !== undefined
                  ? 'bg-primary/50'
                  : 'bg-secondary'
              )}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-secondary rounded-full mb-8">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <p className="text-foreground text-lg leading-relaxed font-medium">{current.prompt}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-8">
        {current.options.map((option, i) => (
          <button
            key={i}
            onClick={() => answerQuestion(current.id, i)}
            className={cn(
              'w-full text-left px-5 py-4 rounded-xl border text-sm transition-all',
              selectedAnswer === i
                ? 'border-primary bg-primary/10 text-foreground font-medium'
                : 'border-border text-foreground hover:border-primary/50 hover:bg-secondary'
            )}
          >
            <span className="font-bold text-primary mr-3">{String.fromCharCode(65 + i)}.</span>
            {option}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-destructive text-sm mb-4 text-center">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <span className="text-sm text-muted-foreground">
          {answeredCount}/{questions.length} answered
        </span>

        {allAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Submit Quiz
              </>
            )}
          </button>
        ) : isLast ? (
          <span className="text-xs text-muted-foreground">Answer all questions to submit</span>
        ) : (
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
