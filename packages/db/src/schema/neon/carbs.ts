import { createId } from '@paralleldrive/cuid2'
import { integer, pgEnum, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'
import { mealPhotos } from './meals.js'
import { users } from './users.js'

export const carbSourceEnum = pgEnum('carb_source', ['manual', 'vision', 'apple_health'])

export const carbEvents = pgTable('carb_events', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  grams: real('grams').notNull(),
  giEstimate: integer('gi_estimate'),
  giConfidence: real('gi_confidence'),
  mealPhotoId: text('meal_photo_id').references(() => mealPhotos.id),
  description: text('description'),
  source: carbSourceEnum('source').notNull().default('manual'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type CarbEventRow = typeof carbEvents.$inferSelect
export type NewCarbEventRow = typeof carbEvents.$inferInsert
