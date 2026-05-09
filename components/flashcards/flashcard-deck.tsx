'use client'

import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { useFlashcardStore } from '@/store/flashcard-store'
import { createClient } from '@/lib/supabase/client'
import { getNextReviewDate } from '@/lib/utils'
import type { Flashcard, Difficulty, SubsectionId } from '@/types'
import { FlashcardView } from './flashcard-view'

interface Props {
  userId: string
  flashcards: Flashcard[]
  reviewMap: Record<string, { difficulty: string; next_review: string }>
  subsectionId: SubsectionId
}

export function FlashcardDeck({ userId, flashcards, reviewMap, subsectionId }: Props) {
  const { cards, currentIndex, setCards, nextCard, prevCard, markReviewed, sessionReviewed, resetSession } =
    useFlashcardStore()

  useEffect(() => {
    setCards(flashcards)
    return () => resetSession()
  }, [flashcards, setCards, resetSession])

  async function handleDifficulty(difficulty: Difficulty) {
    const card = cards[currentIndex]
    if (!card) return

    const nextReview = getNextReviewDate(difficulty)
    const supabase = createClient()

    await supabase.from('flashcard_reviews').upsert({
      user_id: userId,
      flashcard_id: card.id,
      difficulty,
      next_review: nextReview,
      reviewed_at: new Date().toISOString(),
    })

    await supabase.rpc('increment_flashcards_reviewed', {
      p_user_id: userId,
      p_subsection: subsectionId,
    }).maybeSingle()

    markReviewed(card.id)
    nextCard()
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg font-medium text-foreground mb-2">No flashcards yet</p>
        <p className="text-sm">Flashcards for this subsection will appear here once seeded.</p>
      </div>
    )
  }

  const card = cards[currentIndex]
  const isDue = !reviewMap[card?.id ?? ''] || new Date(reviewMap[card?.id ?? '']?.next_review) <= new Date()
  const reviewedThisSession = card ? sessionReviewed.includes(card.id) : false

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{currentIndex + 1}</span>
        <span>/</span>
        <span>{cards.length}</span>
        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {sessionReviewed.length} reviewed
        </span>
      </div>

      {/* Card */}
      {card && (
        <FlashcardView
          card={card}
          onDifficulty={handleDifficulty}
          reviewedThisSession={reviewedThisSession}
          isDue={isDue}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={resetSession}
          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Restart deck"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={nextCard}
          disabled={currentIndex === cards.length - 1}
          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
