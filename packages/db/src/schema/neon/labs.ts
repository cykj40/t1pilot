import { createId } from '@paralleldrive/cuid2'
import { jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const labDocumentTypeEnum = pgEnum('lab_document_type', [
  'a1c',
  'lipid_panel',
  'cbc',
  'metabolic_panel',
  'thyroid',
  'other',
])

export const labProcessingStatusEnum = pgEnum('lab_processing_status', [
  'pending',
  'processing',
  'complete',
  'failed',
])

interface LabMarker {
  value: number
  unit: string
  refRangeLow: number | null
  refRangeHigh: number | null
  flagged: boolean
}

export const labDocuments = pgTable('lab_documents', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  r2Key: text('r2_key').notNull(),
  r2Bucket: text('r2_bucket').notNull(),
  documentType: labDocumentTypeEnum('document_type').notNull(),
  labDate: timestamp('lab_date', { withTimezone: true }),
  processingStatus: labProcessingStatusEnum('processing_status').notNull().default('pending'),
  extractedValues: jsonb('extracted_values').$type<Record<string, LabMarker>>(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type LabDocumentRow = typeof labDocuments.$inferSelect
export type NewLabDocumentRow = typeof labDocuments.$inferInsert
