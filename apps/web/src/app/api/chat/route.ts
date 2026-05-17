import { anthropic } from '@ai-sdk/anthropic'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from 'ai'
import type { ArtifactData, T1UIMessage } from '@/types/artifacts'

const SYSTEM_PROMPT = `You are T1Copilot, an AI assistant specialized in Type 1 diabetes management.
You analyze CGM data, workout patterns, and metabolic events to help the user understand their diabetes.
Rules:
- Never recommend specific insulin doses
- Never suggest changing ISF, ICR, or basal rates
- Always frame insights as patterns to discuss with a care team
- Be concise — responses under 150 words
- End every response with: ⚠️ T1Copilot is assistive only. All health decisions require your judgment and your care team.`

function detectIntent(text: string): 'glucose' | 'exercise' | 'log' | 'insight' | 'general' {
  const lower = text.toLowerCase()
  if (/glucose|trend|cgm|reading|sugar|bg\b|level/.test(lower)) return 'glucose'
  if (/workout|ride|peloton|exercise|run|class|cardio/.test(lower)) return 'exercise'
  if (/log|carb|insulin|inject|dose|bolus/.test(lower)) return 'log'
  if (/insight|pattern|week|summary|analyze|correlation/.test(lower)) return 'insight'
  return 'general'
}

function buildArtifact(intent: string): ArtifactData {
  if (intent === 'glucose') {
    return {
      artifactType: 'glucose_chart',
      currentValue: 142,
      currentTrend: 'FORTY_FIVE_UP',
      timeInRangePercent: 73,
      unit: 'mg/dL',
    }
  }
  if (intent === 'exercise') {
    return {
      artifactType: 'workout_card',
      discipline: 'Cycling',
      durationMinutes: 45,
      glucoseDropMgdl: 28,
      hypoRisk: 'moderate',
    }
  }
  if (intent === 'log') {
    return {
      artifactType: 'event_log_confirmation',
      eventType: 'carbs',
      details: 'Pending HITL approval before logging.',
      requiresApproval: true,
    }
  }
  return {
    artifactType: 'insight_card',
    title: '7-Day Pattern',
    summary:
      'Your time-in-range improved 8% vs last week. Post-workout lows appear 2–4 hours after cycling sessions.',
    confidence: 0.82,
    actionable: true,
  }
}

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as { messages: T1UIMessage[] }
  const { messages } = body

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
  const queryText =
    lastUserMessage?.parts
      .filter((p) => p.type === 'text')
      .map((p) => (p as { type: 'text'; text: string }).text)
      .join('') ?? ''

  const intent = detectIntent(queryText)
  const artifact = buildArtifact(intent)

  const stream = createUIMessageStream<T1UIMessage>({
    execute: async ({ writer }) => {
      writer.write({
        type: 'data-artifact',
        data: artifact,
      })

      const result = streamText({
        model: anthropic('claude-haiku-4-5-20251001'),
        system: SYSTEM_PROMPT,
        messages: await convertToModelMessages(messages),
      })

      writer.merge(result.toUIMessageStream())
    },
  })

  return createUIMessageStreamResponse({ stream })
}
