import { createId } from '@paralleldrive/cuid2'
import { jsonb, pgEnum, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const mealProcessingStatusEnum = pgEnum('meal_processing_status', [
  'pending',
  'processing',
  'complete',
  'failed',
])

interface VisionFood {
  name: string
  grams: number
  gi: number
}

export const mealPhotos = pgTable('meal_photos', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  r2Key: text('r2_key').notNull(),
  r2Bucket: text('r2_bucket'),
  visionResult: jsonb('vision_result'),
  carbEstimateGrams: real('carb_estimate_grams'),
  foodsIdentified: jsonb('foods_identified').$type<VisionFood[]>(),
  confidence: real('confidence'),
  processingStatus: mealProcessingStatusEnum('processing_status').notNull().default('pending'),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type MealPhotoRow = typeof mealPhotos.$inferSelect
export type NewMealPhotoRow = typeof mealPhotos.$inferInsert
