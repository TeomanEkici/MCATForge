import { NextResponse } from 'next/server'
import { z } from 'zod'
import { groq } from '@/lib/openai/client'
import { createClient } from '@/lib/supabase/server'
import { SUBSECTION_LABELS } from '@/lib/utils'
import type { SubsectionId } from '@/types'

const RequestSchema = z.object({
  subsection: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  count: z.union([z.literal(5), z.literal(10), z.literal(20)]),
})

const QuestionSchema = z.object({
  prompt: z.string(),
  options: z.array(z.string()).length(4),
  correct_answer: z.number().int().min(0).max(3),
  explanation: z.string(),
})

const ResponseSchema = z.object({
  questions: z.array(QuestionSchema),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const { subsection, difficulty, count } = parsed.data
  const subsectionLabel = SUBSECTION_LABELS[subsection as SubsectionId] ?? subsection

  const difficultyGuidance = {
    easy: 'straightforward recall and basic comprehension. Single-concept questions.',
    medium: 'application and analysis. Require connecting two or three concepts.',
    hard: 'complex multi-step reasoning, exception cases, or passage-style analysis.',
  }[difficulty]

  const prompt = `Generate exactly ${count} multiple-choice questions about "${subsectionLabel}" for the MCAT exam.
Difficulty: ${difficulty} — ${difficultyGuidance}

Rules:
- 4 answer choices per question
- Exactly one correct answer (correct_answer is 0-indexed: 0=A, 1=B, 2=C, 3=D)
- Distractors must be plausible, not obviously wrong
- Include a clear educational explanation for the correct answer
- Questions must be medically/scientifically accurate and AAMC-style

Respond with ONLY valid JSON, no markdown code blocks, no extra text:
{
  "questions": [
    {
      "prompt": "question text",
      "options": ["A text", "B text", "C text", "D text"],
      "correct_answer": 0,
      "explanation": "Why this is correct and why the others are wrong"
    }
  ]
}`

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert MCAT tutor. You respond ONLY with valid JSON, no markdown, no extra text.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) throw new Error('Empty response from Groq')

    const parsed_response = ResponseSchema.safeParse(JSON.parse(content))
    if (!parsed_response.success) {
      console.error('Schema validation failed:', parsed_response.error)
      throw new Error('Invalid response structure from AI')
    }

    const questions = parsed_response.data.questions.slice(0, count).map((q) => ({
      ...q,
      id: crypto.randomUUID(),
      subsection,
      difficulty,
      created_at: new Date().toISOString(),
    }))

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Quiz generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
