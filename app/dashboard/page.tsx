import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(10)

  const { data: progress } = await supabase
    .from('progress_metrics')
    .select('*')
    .eq('user_id', user.id)

  const { data: reviewsToday } = await supabase
    .from('flashcard_reviews')
    .select('id')
    .eq('user_id', user.id)
    .gte('reviewed_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())

  return (
    <DashboardContent
      user={user}
      recentAttempts={attempts ?? []}
      progressMetrics={progress ?? []}
      flashcardsReviewedToday={reviewsToday?.length ?? 0}
    />
  )
}
