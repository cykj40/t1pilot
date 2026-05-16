import { createId } from '@paralleldrive/cuid2'
import { integer, pgEnum, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const insulinTypeEnum = pgEnum('insulin_type', ['rapid', 'long', 'correction'])

export const insulinSourceEnum = pgEnum('insulin_source', ['manual', 'apple_health'])

export const insulinEvents = pgTable('insulin_events', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  units: real('units').notNull(),
  insulinType: insulinTypeEnum('insulin_type').notNull(),
  iobDurationMinutes: integer('iob_duration_minutes'),
  brand: text('brand'),
  note: text('note'),
  source: insulinSourceEnum('source').notNull().default('manual'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type InsulinEventRow = typeof insulinEvents.$inferSelect
export type NewInsulinEventRow = typeof insulinEvents.$inferInsert
