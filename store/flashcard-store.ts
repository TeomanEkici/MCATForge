import { create } from 'zustand'
import type { Flashcard } from '@/types'

interface FlashcardState {
  cards: Flashcard[]
  currentIndex: number
  isFlipped: boolean
  sessionReviewed: string[]

  setCards: (cards: Flashcard[]) => void
  flipCard: () => void
  nextCard: () => void
  prevCard: () => void
  markReviewed: (id: string) => void
  resetSession: () => void
}

export const useFlashcardStore = create<FlashcardState>((set) => ({
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  sessionReviewed: [],

  setCards: (cards) => set({ cards, currentIndex: 0, isFlipped: false }),

  flipCard: () => set((state) => ({ isFlipped: !state.isFlipped })),

  nextCard: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.cards.length - 1),
      isFlipped: false,
    })),

  prevCard: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
      isFlipped: false,
    })),

  markReviewed: (id) =>
    set((state) => ({
      sessionReviewed: state.sessionReviewed.includes(id)
        ? state.sessionReviewed
        : [...state.sessionReviewed, id],
    })),

  resetSession: () => set({ currentIndex: 0, isFlipped: false, sessionReviewed: [] }),
}))
