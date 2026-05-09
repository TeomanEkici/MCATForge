'use client'

import { useState } from 'react'
import { BookOpen, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Section, Subsection, Flashcard, SubsectionId } from '@/types'
import { FlashcardDeck } from '@/components/flashcards/flashcard-deck'
import { QuizLauncher } from '@/components/quizzes/quiz-launcher'

interface Props {
  userId: string
  section: Section
  subsection: Subsection
  flashcards: Flashcard[]
  reviewMap: Record<string, { difficulty: string; next_review: string }>
  progress: { flashcards_reviewed: number; quiz_accuracy: number } | null
  subsectionId: SubsectionId
}

type Tab = 'flashcards' | 'quiz'

export function StudyWorkspace({ userId, section, subsection, flashcards, reviewMap, progress, subsectionId }: Props) {
  const [tab, setTab] = useState<Tab>('flashcards')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-muted-foreground text-sm mb-1">{section.shortName}</p>
        <h1 className="text-3xl font-bold text-foreground">{subsection.name}</h1>
        {progress && (
          <div className="flex gap-4 mt-3">
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{progress.flashcards_reviewed}</span> flashcards reviewed
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{Math.round(progress.quiz_accuracy)}%</span> quiz accuracy
            </span>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {(['flashcards', 'quiz'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors capitalize',
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t === 'flashcards' ? <BookOpen className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
            {t === 'flashcards' ? 'Flashcards' : 'Quiz'}
          </button>
        ))}
      </div>

      {tab === 'flashcards' ? (
        <FlashcardDeck
          userId={userId}
          flashcards={flashcards}
          reviewMap={reviewMap}
          subsectionId={subsectionId}
        />
      ) : (
        <QuizLauncher subsectionId={subsectionId} userId={userId} />
      )}
    </div>
  )
}
