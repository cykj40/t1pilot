import { createId } from '@paralleldrive/cuid2'
import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

interface ParamDriftEntry {
  param: string
  currentValue: number
  suggestedValue: number
  delta: number
}

interface LabFlagEntry {
  marker: string
  value: number
  unit: string
  flagged: boolean
}

interface ReportData {
  timeInRange: number
  avgGlucose: number
  hypoEvents: number
  hyperEvents: number
  paramDrift: ParamDriftEntry[]
  labFlags: LabFlagEntry[]
  agentNotes: string[]
  openQuestions: string[]
}

export const appointmentReports = pgTable('appointment_reports', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  reportData: jsonb('report_data').$type<ReportData>().notNull(),
  r2Key: text('r2_key'),
  r2Bucket: text('r2_bucket'),
  pdfGeneratedAt: timestamp('pdf_generated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type AppointmentReportRow = typeof appointmentReports.$inferSelect
export type NewAppointmentReportRow = typeof appointmentReports.$inferInsert
