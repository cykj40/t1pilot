import { createId } from '@paralleldrive/cuid2'
import { integer, jsonb, pgEnum, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const exerciseSourceEnum = pgEnum('exercise_source', ['peloton', 'apple_health', 'manual'])

export const exerciseEvents = pgTable('exercise_events', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  exerciseType: text('exercise_type').notNull(),
  intensityPercent: real('intensity_percent'),
  avgHeartRate: integer('avg_heart_rate'),
  calories: integer('calories'),
  source: exerciseSourceEnum('source').notNull().default('manual'),
  externalId: text('external_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type ExerciseEventRow = typeof exerciseEvents.$inferSelect
export type NewExerciseEventRow = typeof exerciseEvents.$inferInsert
