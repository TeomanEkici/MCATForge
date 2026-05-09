import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { addDays, format } from 'date-fns'
import type { Difficulty, SectionId, SubsectionId } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNextReviewDate(difficulty: Difficulty): string {
  const daysMap: Record<Difficulty, number> = {
    easy: 7,
    medium: 3,
    hard: 1,
  }
  return addDays(new Date(), daysMap[difficulty]).toISOString()
}

export function formatDate(date: string) {
  return format(new Date(date), 'MMM d, yyyy')
}

export function scoreToPercent(score: number, total: number): number {
  if (total === 0) return 0
  return Math.round((score / total) * 100)
}

export const SECTION_LABELS: Record<SectionId, string> = {
  'bio-biochem': 'Biological & Biochemical Foundations',
  'chem-phys': 'Chemical & Physical Foundations',
  'psych-soc': 'Psychological, Social & Biological Foundations',
  cars: 'Critical Analysis & Reasoning Skills',
}

export const SECTION_SHORT_LABELS: Record<SectionId, string> = {
  'bio-biochem': 'Bio/Biochem',
  'chem-phys': 'Chem/Phys',
  'psych-soc': 'Psych/Soc',
  cars: 'CARS',
}

export const SUBSECTION_LABELS: Record<SubsectionId, string> = {
  biochemistry: 'Biochemistry',
  'molecular-biology': 'Molecular Biology',
  genetics: 'Genetics',
  metabolism: 'Metabolism',
  'cell-biology': 'Cell Biology',
  'general-chemistry': 'General Chemistry',
  'organic-chemistry': 'Organic Chemistry',
  physics: 'Physics',
  thermodynamics: 'Thermodynamics',
  electrochemistry: 'Electrochemistry',
  psychology: 'Psychology',
  sociology: 'Sociology',
  'behavioral-science': 'Behavioral Science',
  'passage-analysis': 'Passage Analysis',
  'reading-comprehension': 'Reading Comprehension',
  'logic-reasoning': 'Logic & Reasoning',
}

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'text-green-400',
  medium: 'text-yellow-400',
  hard: 'text-red-400',
}
