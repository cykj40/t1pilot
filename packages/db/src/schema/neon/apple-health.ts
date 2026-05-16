import { createId } from '@paralleldrive/cuid2'
import { jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const healthProcessingStatusEnum = pgEnum('health_processing_status', [
  'pending',
  'processing',
  'complete',
  'failed',
])

interface NormalizedEventIds {
  glucoseReadingIds?: string[]
  insulinEventIds?: string[]
  carbEventIds?: string[]
  exerciseEventIds?: string[]
}

export const appleHealthRaw = pgTable('apple_health_raw', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  receivedAt: timestamp('received_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
  payload: jsonb('payload').notNull(),
  dataTypes: jsonb('data_types').$type<string[]>(),
  processingStatus: healthProcessingStatusEnum('processing_status').notNull().default('pending'),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  errorMessage: text('error_message'),
  normalizedEventIds: jsonb('normalized_event_ids').$type<NormalizedEventIds>(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type AppleHealthRawRow = typeof appleHealthRaw.$inferSelect
export type NewAppleHealthRawRow = typeof appleHealthRaw.$inferInsert
