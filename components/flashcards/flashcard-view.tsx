'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Flashcard, Difficulty } from '@/types'

interface Props {
  card: Flashcard
  onDifficulty: (d: Difficulty) => Promise<void>
  reviewedThisSession: boolean
  isDue: boolean
}

export function FlashcardView({ card, onDifficulty, reviewedThisSession, isDue }: Props) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleDifficulty(d: Difficulty) {
    setIsSubmitting(true)
    await onDifficulty(d)
    setIsFlipped(false)
    setIsSubmitting(false)
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Card */}
      <div
        className="card-flip w-full cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ height: 280 }}
      >
        <div className={cn('card-flip-inner relative w-full h-full', isFlipped && 'flipped')}>
          {/* Front */}
          <div className="card-front absolute inset-0 bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
              {isDue ? 'Due for review' : 'Reviewed'}
            </p>
            <p className="text-foreground text-lg text-center font-medium leading-relaxed">{card.front}</p>
            <p className="text-xs text-muted-foreground mt-6">Click to reveal answer</p>
          </div>

          {/* Back */}
          <div className="card-back absolute inset-0 bg-card border border-primary/40 rounded-xl p-8 flex flex-col items-center justify-center">
            <p className="text-xs text-primary mb-4 font-medium uppercase tracking-wider">Answer</p>
            <p className="text-foreground text-base text-center leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>

      {/* Difficulty buttons — shown when flipped */}
      {isFlipped && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <p className="text-sm text-muted-foreground mr-2">How well did you know this?</p>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => handleDifficulty(d)}
              disabled={isSubmitting}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors border disabled:opacity-50 disabled:cursor-not-allowed',
                d === 'easy' && 'border-green-600 text-green-400 hover:bg-green-600/10',
                d === 'medium' && 'border-yellow-600 text-yellow-400 hover:bg-yellow-600/10',
                d === 'hard' && 'border-red-600 text-red-400 hover:bg-red-600/10'
              )}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {reviewedThisSession && !isFlipped && (
        <p className="text-center text-xs text-green-400 mt-3">Reviewed this session</p>
      )}
    </div>
  )
}
