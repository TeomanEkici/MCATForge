export type SectionId = 'bio-biochem' | 'chem-phys' | 'psych-soc' | 'cars'

export type SubsectionId =
  // Bio/Biochem
  | 'biochemistry'
  | 'molecular-biology'
  | 'genetics'
  | 'metabolism'
  | 'cell-biology'
  // Chem/Phys
  | 'general-chemistry'
  | 'organic-chemistry'
  | 'physics'
  | 'thermodynamics'
  | 'electrochemistry'
  // Psych/Soc
  | 'psychology'
  | 'sociology'
  | 'behavioral-science'
  // CARS
  | 'passage-analysis'
  | 'reading-comprehension'
  | 'logic-reasoning'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Section {
  id: SectionId
  name: string
  shortName: string
  subsections: Subsection[]
}

export interface Subsection {
  id: SubsectionId
  sectionId: SectionId
  name: string
}

export interface Flashcard {
  id: string
  section: SectionId
  subsection: SubsectionId
  front: string
  back: string
  difficulty: Difficulty | null
  next_review: string | null
  created_at: string
}

export interface FlashcardReview {
  id: string
  user_id: string
  flashcard_id: string
  difficulty: Difficulty
  reviewed_at: string
  next_review: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correct_answer: number
  explanation: string
  subsection: SubsectionId
  difficulty: Difficulty
  created_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  subsection: SubsectionId
  score: number
  total: number
  difficulty: Difficulty
  answers: Record<string, number>
  completed_at: string
}

export interface ProgressMetric {
  id: string
  user_id: string
  subsection: SubsectionId
  flashcards_reviewed: number
  quiz_accuracy: number
  time_spent_minutes: number
  updated_at: string
}

export interface GenerateQuizInput {
  subsection: SubsectionId
  difficulty: Difficulty
  count: 5 | 10 | 20
}

export interface GenerateQuizOutput {
  questions: Omit<QuizQuestion, 'id' | 'created_at'>[]
}

export interface DashboardStats {
  overallProgress: number
  sectionProgress: Record<SectionId, number>
  recentQuizScores: Array<{ subsection: SubsectionId; score: number; total: number; date: string }>
  flashcardsReviewedToday: number
  weakestSubsection: SubsectionId | null
}
