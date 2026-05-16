import { createId } from '@paralleldrive/cuid2'
import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const researchCache = pgTable('research_cache', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  query: text('query').notNull(),
  sourceUrl: text('source_url'),
  sourceTitle: text('source_title'),
  content: text('content').notNull(),
  agentSummary: text('agent_summary'),
  relevanceTags: jsonb('relevance_tags').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type ResearchCacheRow = typeof researchCache.$inferSelect
export type NewResearchCacheRow = typeof researchCache.$inferInsert
