import { Badge } from '@/components/ui/badge'

interface AgentStatus {
  name: string
  active: boolean
}

const AGENTS: AgentStatus[] = [
  { name: 'Glucose', active: true },
  { name: 'Exercise', active: true },
  { name: 'Modeling', active: false },
  { name: 'Logger', active: true },
  { name: 'Insight', active: true },
]

export function AgentStatusBar() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Agents</p>
      <div className="flex flex-wrap gap-1">
        {AGENTS.map((agent) => (
          <Badge
            key={agent.name}
            variant="outline"
            className={
              agent.active
                ? 'border-primary/40 bg-primary/10 text-primary text-[10px] px-1.5 py-0'
                : 'border-border bg-muted text-muted-foreground text-[10px] px-1.5 py-0'
            }
          >
            <span
              className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${agent.active ? 'bg-primary' : 'bg-muted-foreground'}`}
            />
            {agent.name}
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        <p className="text-[10px] text-muted-foreground">MCP: not connected</p>
      </div>
    </div>
  )
}
