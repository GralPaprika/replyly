import {pgTable, uuid, text, jsonb, vector} from 'drizzle-orm/pg-core'

// text-embedding-3-small
// https://platform.openai.com/docs/guides/embeddings/how-to-get-embeddings
const EMBEDDING_VECTOR_SIZE = 1536

/**
 * Table to store the default responses that the business can use to reply to the user.
 * Business information should be stored in metadata, which is a JSON object.
 */
export const businessResponses = pgTable('business_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  metadata: jsonb('metadata').notNull(),
  vector: vector('vector', { dimensions: EMBEDDING_VECTOR_SIZE }).notNull(),
})
