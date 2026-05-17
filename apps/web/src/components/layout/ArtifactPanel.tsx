'use client'

import { X } from 'lucide-react'
import { GlucoseCard } from '@/components/glucose/GlucoseCard'
import { InsightFeed } from '@/components/insights/InsightFeed'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ArtifactData } from '@/types/artifacts'

interface ArtifactPanelProps {
  artifact: ArtifactData | null
  onClose: () => void
}

function WorkoutArtifact({
  data,
}: {
  data: Extract<ArtifactData, { artifactType: 'workout_card' }>
}) {
  const riskColor = {
    low: 'text-green-400 border-green-400/40 bg-green-400/10',
    moderate: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
    high: 'text-red-400 border-red-400/40 bg-red-400/10',
  }[data.hypoRisk]

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-4 pb-3 px-4">
        <p className="text-xs text-muted-foreground mb-1">Last Workout Impact</p>
        <p className="text-sm font-medium text-foreground">{data.discipline}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{String(data.durationMinutes)} min</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {data.glucoseDropMgdl > 0 ? '-' : '+'}
            {String(Math.abs(data.glucoseDropMgdl))}
          </span>
          <span className="text-xs text-muted-foreground">mg/dL avg drop</span>
          <Badge variant="outline" className={`ml-auto text-[10px] ${riskColor}`}>
            {data.hypoRisk.toUpperCase()} RISK
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function EventLogArtifact({
  data,
}: {
  data: Extract<ArtifactData, { artifactType: 'event_log_confirmation' }>
}) {
  return (
    <Card className="border-yellow-400/30 bg-yellow-400/5">
      <CardContent className="pt-4 pb-3 px-4">
        <p className="text-xs text-yellow-400 font-medium mb-1">⚠️ Requires Approval</p>
        <p className="text-sm text-foreground capitalize">{data.eventType} event</p>
        <p className="text-xs text-muted-foreground mt-1">{data.details}</p>
      </CardContent>
    </Card>
  )
}

function InsightArtifact({
  data,
}: {
  data: Extract<ArtifactData, { artifactType: 'insight_card' }>
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-4 pb-3 px-4">
        <p className="text-xs text-muted-foreground mb-1">Insight</p>
        <p className="text-sm font-medium text-foreground">{data.title}</p>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{data.summary}</p>
      </CardContent>
    </Card>
  )
}

function ArtifactRenderer({ artifact }: { artifact: ArtifactData }) {
  if (artifact.artifactType === 'glucose_chart') {
    return (
      <GlucoseCard
        value={artifact.currentValue}
        trend={artifact.currentTrend as Parameters<typeof GlucoseCard>[0]['trend']}
        timestamp={new Date().toISOString()}
      />
    )
  }
  if (artifact.artifactType === 'workout_card') {
    return <WorkoutArtifact data={artifact} />
  }
  if (artifact.artifactType === 'event_log_confirmation') {
    return <EventLogArtifact data={artifact} />
  }
  if (artifact.artifactType === 'insight_card') {
    return <InsightArtifact data={artifact} />
  }
  return null
}

export function ArtifactPanel({ artifact, onClose }: ArtifactPanelProps) {
  return (
    <div className="flex h-full flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="flex h-10 items-center justify-between border-b border-border px-4 shrink-0">
        <span className="text-xs font-medium text-muted-foreground">Artifacts</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 p-3">
          {artifact !== null ? (
            <ArtifactRenderer artifact={artifact} />
          ) : (
            <>
              {/* Default placeholder cards */}
              <GlucoseCard
                value={142}
                trend="FORTY_FIVE_UP"
                timestamp={new Date(Date.now() - 5 * 60000).toISOString()}
              />
              <Card className="bg-card border-border">
                <CardContent className="pt-4 pb-3 px-4">
                  <p className="text-xs text-muted-foreground mb-1">Time in Range</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-green-400">73</span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Last 7 days</p>
                </CardContent>
              </Card>
              <InsightFeed />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
