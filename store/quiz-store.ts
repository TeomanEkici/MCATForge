import { create } from 'zustand'
import type { QuizQuestion, Difficulty, SubsectionId } from '@/types'

interface QuizState {
  questions: QuizQuestion[]
  currentIndex: number
  answers: Record<string, number>
  subsection: SubsectionId | null
  difficulty: Difficulty | null
  isLoading: boolean
  isSubmitted: boolean

  setQuiz: (questions: QuizQuestion[], subsection: SubsectionId, difficulty: Difficulty) => void
  answerQuestion: (questionId: string, answerIndex: number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  submitQuiz: () => void
  resetQuiz: () => void
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  currentIndex: 0,
  answers: {},
  subsection: null,
  difficulty: null,
  isLoading: false,
  isSubmitted: false,

  setQuiz: (questions, subsection, difficulty) =>
    set({ questions, subsection, difficulty, currentIndex: 0, answers: {}, isSubmitted: false }),

  answerQuestion: (questionId, answerIndex) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: answerIndex } })),

  nextQuestion: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
    })),

  prevQuestion: () =>
    set((state) => ({ currentIndex: Math.max(state.currentIndex - 1, 0) })),

  submitQuiz: () => set({ isSubmitted: true }),

  resetQuiz: () =>
    set({
      questions: [],
      currentIndex: 0,
      answers: {},
      subsection: null,
      difficulty: null,
      isLoading: false,
      isSubmitted: false,
    }),
}))
