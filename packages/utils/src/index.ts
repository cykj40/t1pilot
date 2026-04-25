// ── Glucose unit conversion ───────────────────────────────────────────────────

export function mgdlToMmol(mgdl: number): number {
  return Math.round((mgdl / 18.018) * 10) / 10
}

export function mmolToMgdl(mmol: number): number {
  return Math.round(mmol * 18.018)
}

// ── Range helpers ─────────────────────────────────────────────────────────────

export const GLUCOSE_RANGES = {
  hypoCritical: { min: 0, max: 54 },
  hypo: { min: 54, max: 70 },
  inRange: { min: 70, max: 180 },
  hyperMild: { min: 180, max: 250 },
  hyperCritical: { min: 250, max: Infinity },
} as const

export type GlucoseZone = keyof typeof GLUCOSE_RANGES

export function classifyGlucose(mgdl: number): GlucoseZone {
  if (mgdl < 54) return 'hypoCritical'
  if (mgdl < 70) return 'hypo'
  if (mgdl <= 180) return 'inRange'
  if (mgdl <= 250) return 'hyperMild'
  return 'hyperCritical'
}

// ── Date / time ───────────────────────────────────────────────────────────────

export function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000)
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// ── Misc ──────────────────────────────────────────────────────────────────────

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`)
}

export function exhaustive(value: never): never {
  throw new Error(`Unhandled value: ${String(value)}`)
}
