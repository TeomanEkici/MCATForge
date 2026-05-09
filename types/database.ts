export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      sections: {
        Row: { id: string; name: string; short_name: string; order_index: number }
        Insert: { id: string; name: string; short_name: string; order_index: number }
        Update: Partial<{ id: string; name: string; short_name: string; order_index: number }>
      }
      subsections: {
        Row: { id: string; section_id: string; name: string; order_index: number }
        Insert: { id: string; section_id: string; name: string; order_index: number }
        Update: Partial<{ id: string; section_id: string; name: string; order_index: number }>
      }
      flashcards: {
        Row: {
          id: string
          section: string
          subsection: string
          front: string
          back: string
          difficulty: string | null
          next_review: string | null
          created_at: string
        }
        Insert: {
          id?: string
          section: string
          subsection: string
          front: string
          back: string
          difficulty?: string | null
          next_review?: string | null
          created_at?: string
        }
        Update: Partial<{
          section: string
          subsection: string
          front: string
          back: string
          difficulty: string | null
          next_review: string | null
        }>
      }
      flashcard_reviews: {
        Row: {
          id: string
          user_id: string
          flashcard_id: string
          difficulty: string
          reviewed_at: string
          next_review: string
        }
        Insert: {
          id?: string
          user_id: string
          flashcard_id: string
          difficulty: string
          reviewed_at?: string
          next_review: string
        }
        Update: Partial<{ difficulty: string; next_review: string }>
      }
      quiz_questions: {
        Row: {
          id: string
          prompt: string
          options: Json
          correct_answer: number
          explanation: string
          subsection: string
          difficulty: string
          created_at: string
        }
        Insert: {
          id?: string
          prompt: string
          options: Json
          correct_answer: number
          explanation: string
          subsection: string
          difficulty: string
          created_at?: string
        }
        Update: Partial<{
          prompt: string
          options: Json
          correct_answer: number
          explanation: string
          subsection: string
          difficulty: string
        }>
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          subsection: string
          score: number
          total: number
          difficulty: string
          answers: Json
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subsection: string
          score: number
          total: number
          difficulty: string
          answers: Json
          completed_at?: string
        }
        Update: never
      }
      progress_metrics: {
        Row: {
          id: string
          user_id: string
          subsection: string
          flashcards_reviewed: number
          quiz_accuracy: number
          time_spent_minutes: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subsection: string
          flashcards_reviewed?: number
          quiz_accuracy?: number
          time_spent_minutes?: number
          updated_at?: string
        }
        Update: Partial<{
          flashcards_reviewed: number
          quiz_accuracy: number
          time_spent_minutes: number
          updated_at: string
        }>
      }
    }
  }
}
