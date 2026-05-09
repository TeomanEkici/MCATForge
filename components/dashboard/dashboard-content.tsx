'use client'

import Link from 'next/link'
import { BarChart3, BookOpen, Flame, TrendingDown } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { MCAT_SECTIONS } from '@/lib/mcat-taxonomy'
import { scoreToPercent, SECTION_SHORT_LABELS, SUBSECTION_LABELS } from '@/lib/utils'
import type { SectionId, SubsectionId } from '@/types'
import { ProgressBar } from './progress-bar'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface Props {
  user: User
  recentAttempts: Array<{
    id: string
    subsection: string
    score: number
    total: number
    difficulty: string
    completed_at: string
  }>
  progressMetrics: Array<{
    subsection: string
    flashcards_reviewed: number
    quiz_accuracy: number
  }>
  flashcardsReviewedToday: number
}

export function DashboardContent({ user, recentAttempts, progressMetrics, flashcardsReviewedToday }: Props) {
  const progressMap = Object.fromEntries(progressMetrics.map((p) => [p.subsection, p]))

  const sectionProgress: Record<string, number> = {}
  for (const section of MCAT_SECTIONS) {
    const subs = section.subsections
    const total = subs.reduce((acc, sub) => {
      const p = progressMap[sub.id]
      return acc + (p ? p.quiz_accuracy : 0)
    }, 0)
    sectionProgress[section.id] = Math.round(total / subs.length)
  }

  const allSectionValues = Object.values(sectionProgress)
  const overallProgress = allSectionValues.length
    ? Math.round(allSectionValues.reduce((a, b) => a + b, 0) / allSectionValues.length)
    : 0

  const weakest = progressMetrics.length
    ? progressMetrics.reduce((a, b) => (a.quiz_accuracy < b.quiz_accuracy ? a : b))
    : null

  const radarData = MCAT_SECTIONS.map((s) => ({
    section: s.shortName,
    value: sectionProgress[s.id] ?? 0,
  }))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your MCAT prep overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<BarChart3 className="h-5 w-5 text-primary" />}
          label="Overall Progress"
          value={`${overallProgress}%`}
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-blue-400" />}
          label="Quizzes Taken"
          value={recentAttempts.length.toString()}
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-400" />}
          label="Flashcards Today"
          value={flashcardsReviewedToday.toString()}
        />
        <StatCard
          icon={<TrendingDown className="h-5 w-5 text-red-400" />}
          label="Weakest Area"
          value={weakest ? SUBSECTION_LABELS[weakest.subsection as SubsectionId] ?? weakest.subsection : '—'}
          small
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Section progress */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-4">Section Progress</h2>
          <div className="flex flex-col gap-4">
            {MCAT_SECTIONS.map((section) => (
              <div key={section.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <Link
                    href={`/study/${section.id}/${section.subsections[0].id}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {SECTION_SHORT_LABELS[section.id as SectionId]}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {sectionProgress[section.id] ?? 0}%
                  </span>
                </div>
                <ProgressBar value={sectionProgress[section.id] ?? 0} />
              </div>
            ))}
          </div>
        </div>

        {/* Radar chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-4">Performance Radar</h2>
          {overallProgress === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              Take some quizzes to see your radar chart
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="section" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent quiz scores */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold text-foreground mb-4">Recent Quiz Scores</h2>
        {recentAttempts.length === 0 ? (
          <div className="text-muted-foreground text-sm py-8 text-center">
            No quizzes taken yet.{' '}
            <Link href={`/study/${MCAT_SECTIONS[0].id}/${MCAT_SECTIONS[0].subsections[0].id}`} className="text-primary hover:underline">
              Start studying
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentAttempts.map((attempt) => {
              const pct = scoreToPercent(attempt.score, attempt.total)
              return (
                <div key={attempt.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {SUBSECTION_LABELS[attempt.subsection as SubsectionId] ?? attempt.subsection}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{attempt.difficulty}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${pct >= 80 ? 'text-green-400' : pct >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {pct}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {attempt.score}/{attempt.total}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, small }: { icon: React.ReactNode; label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">{icon}{label}</div>
      <p className={`font-bold text-foreground ${small ? 'text-base' : 'text-2xl'}`}>{value}</p>
    </div>
  )
}
