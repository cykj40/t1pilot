import { createId } from '@paralleldrive/cuid2'
import { index, pgEnum, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const trendArrowEnum = pgEnum('trend_arrow', [
  'NONE',
  'DOUBLE_UP',
  'SINGLE_UP',
  'FORTY_FIVE_UP',
  'FLAT',
  'FORTY_FIVE_DOWN',
  'SINGLE_DOWN',
  'DOUBLE_DOWN',
  'NOT_COMPUTABLE',
  'RATE_OUT_OF_RANGE',
])

export const glucoseSourceEnum = pgEnum('glucose_source', ['dexcom', 'apple_health'])

export const glucoseReadings = pgTable(
  'glucose_readings',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    dexcomRecordId: text('dexcom_record_id').unique(),
    systemTime: timestamp('system_time', { withTimezone: true }).notNull(),
    displayTime: timestamp('display_time', { withTimezone: true }).notNull(),
    valueMgdl: real('value_mgdl').notNull(),
    trend: trendArrowEnum('trend'),
    trendRate: real('trend_rate'),
    source: glucoseSourceEnum('source').notNull().default('dexcom'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [index('glucose_user_id_system_time_idx').on(table.userId, table.systemTime)],
)

export type PgGlucoseReadingRow = typeof glucoseReadings.$inferSelect
export type NewPgGlucoseReadingRow = typeof glucoseReadings.$inferInsert
