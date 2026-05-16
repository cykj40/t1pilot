import { createId } from '@paralleldrive/cuid2'
import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

interface UserPreferences {
  glucoseUnit: 'mg/dL' | 'mmol/L'
  alertLowMgdl: number
  alertHighMgdl: number
  alertUrgentLowMgdl: number
  agentVerbosity: 'concise' | 'detailed'
  requireApprovalForAllRecommendations: boolean
  enableMealVision: boolean
  enableLabRag: boolean
  enableGlucoseEmbeddings: boolean
}

interface DiabetesParams {
  isf: number | null
  icr: number | null
  basalDose: number | null
  rapidDurationHours: number
  rapidPeakHours: number
  agentConfidence: number | null
}

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  authProviderId: text('auth_provider_id').notNull().unique(),
  preferences: jsonb('preferences').$type<UserPreferences>().notNull(),
  diabetesParams: jsonb('diabetes_params').$type<DiabetesParams>().notNull(),
  onboardingComplete: boolean('onboarding_complete').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type UserRow = typeof users.$inferSelect
export type NewUserRow = typeof users.$inferInsert
