import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface InsightCardProps {
  title: string
  summary: string
  confidence: number
  actionable: boolean
}

export function InsightCard({ title, summary, confidence, actionable }: InsightCardProps) {
  const confidencePct = Math.round(confidence * 100)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground leading-tight">{title}</p>
          <Badge
            variant="outline"
            className="shrink-0 text-[10px] border-primary/30 bg-primary/10 text-primary"
          >
            {String(confidencePct)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
      </CardContent>
      {actionable && (
        <CardFooter className="px-4 pb-3 pt-0">
          <Button variant="outline" size="sm" className="h-7 text-xs border-border hover:bg-accent">
            Review with agent
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
