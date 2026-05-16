import { createId } from '@paralleldrive/cuid2'
import { boolean, pgEnum, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const observationEventTypeEnum = pgEnum('observation_event_type', [
  'glucose',
  'insulin',
  'carb',
  'exercise',
  'correction',
])

export const observationParamTypeEnum = pgEnum('observation_param_type', [
  'isf',
  'icr',
  'basal',
  'rapid_duration',
  'rapid_peak',
])

export const adaptiveObservations = pgTable('adaptive_observations', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  observedAt: timestamp('observed_at', { withTimezone: true }).notNull(),
  eventType: observationEventTypeEnum('event_type').notNull(),
  eventId: text('event_id').notNull(),
  paramType: observationParamTypeEnum('param_type').notNull(),
  predictedValue: real('predicted_value').notNull(),
  actualValue: real('actual_value').notNull(),
  delta: real('delta').notNull(),
  currentParamValue: real('current_param_value').notNull(),
  suggestedParamValue: real('suggested_param_value'),
  agentNote: text('agent_note'),
  userAcknowledged: boolean('user_acknowledged').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type AdaptiveObservationRow = typeof adaptiveObservations.$inferSelect
export type NewAdaptiveObservationRow = typeof adaptiveObservations.$inferInsert
