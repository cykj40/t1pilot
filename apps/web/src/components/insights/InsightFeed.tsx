import { InsightCard } from './InsightCard'

interface Insight {
  id: string
  title: string
  summary: string
  confidence: number
  actionable: boolean
}

const MOCK_INSIGHTS: Insight[] = [
  {
    id: '1',
    title: 'Post-ride glucose drop',
    summary:
      'Your glucose drops an average of 28 mg/dL in the 2–3 hours after cycling sessions. Consider a small carb snack post-ride.',
    confidence: 0.87,
    actionable: true,
  },
  {
    id: '2',
    title: 'Morning baseline drift',
    summary:
      'Your fasting glucose has trended 15 mg/dL higher this week compared to the prior two weeks.',
    confidence: 0.74,
    actionable: false,
  },
]

export function InsightFeed() {
  return (
    <div className="flex flex-col gap-2">
      {MOCK_INSIGHTS.map((insight) => (
        <InsightCard
          key={insight.id}
          title={insight.title}
          summary={insight.summary}
          confidence={insight.confidence}
          actionable={insight.actionable}
        />
      ))}
    </div>
  )
}
