import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const subsection = searchParams.get('subsection')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let query = supabase.from('flashcards').select('*')
  if (subsection) query = query.eq('subsection', subsection)

  const { data, error } = await query.order('created_at')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ flashcards: data })
}
