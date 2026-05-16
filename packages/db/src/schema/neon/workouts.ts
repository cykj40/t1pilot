import { createId } from '@paralleldrive/cuid2'
import { boolean, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'
import { exerciseEvents } from './exercise.js'
import { users } from './users.js'

export const workoutGlucoseCorrelations = pgTable('workout_glucose_correlations', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  exerciseEventId: text('exercise_event_id')
    .notNull()
    .references(() => exerciseEvents.id),
  glucosePreMgdl: real('glucose_pre_mgdl'),
  glucoseDuringMgdl: real('glucose_during_mgdl'),
  glucosePost1hMgdl: real('glucose_post_1h_mgdl'),
  glucosePost2hMgdl: real('glucose_post_2h_mgdl'),
  glucoseDropMgdl: real('glucose_drop_mgdl'),
  hypoEventPost: boolean('hypo_event_post').notNull().default(false),
  hypoThresholdMgdl: real('hypo_threshold_mgdl').notNull().default(70),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type WorkoutGlucoseCorrelationRow = typeof workoutGlucoseCorrelations.$inferSelect
export type NewWorkoutGlucoseCorrelationRow = typeof workoutGlucoseCorrelations.$inferInsert
