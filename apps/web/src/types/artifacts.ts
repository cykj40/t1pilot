import type { UIMessage } from 'ai'

export interface GlucoseChartArtifact {
  artifactType: 'glucose_chart'
  currentValue: number
  currentTrend: string
  timeInRangePercent: number
  unit: string
}

export interface InsightCardArtifact {
  artifactType: 'insight_card'
  title: string
  summary: string
  confidence: number
  actionable: boolean
}

export interface WorkoutCardArtifact {
  artifactType: 'workout_card'
  discipline: string
  durationMinutes: number
  glucoseDropMgdl: number
  hypoRisk: 'low' | 'moderate' | 'high'
}

export interface EventLogArtifact {
  artifactType: 'event_log_confirmation'
  eventType: 'insulin' | 'carbs' | 'exercise'
  details: string
  requiresApproval: boolean
}

export interface ParameterDisplayArtifact {
  artifactType: 'parameter_display'
  isf: number
  icr: number
  basalUnitsPerDay: number
}

export type ArtifactData =
  | GlucoseChartArtifact
  | InsightCardArtifact
  | WorkoutCardArtifact
  | EventLogArtifact
  | ParameterDisplayArtifact

export type T1DataTypes = {
  artifact: ArtifactData
}

export type T1UIMessage = UIMessage<unknown, T1DataTypes>
