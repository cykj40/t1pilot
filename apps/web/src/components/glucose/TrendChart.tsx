'use client'

import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface DataPoint {
  time: string
  value: number
}

interface TrendChartProps {
  data: DataPoint[]
  height?: number
}

export function TrendChart({ data, height = 120 }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-muted-foreground"
        style={{ height }}
      >
        No data
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[40, 300]}
          tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            fontSize: 11,
          }}
          labelStyle={{ color: 'var(--color-muted-foreground)' }}
          itemStyle={{ color: '#22c55e' }}
        />
        <ReferenceLine y={70} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.5} />
        <ReferenceLine y={180} stroke="#eab308" strokeDasharray="3 3" strokeOpacity={0.5} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#22c55e"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: '#22c55e' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
