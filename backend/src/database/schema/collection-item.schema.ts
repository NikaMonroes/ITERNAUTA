
import {
  pgTable,
  serial,
  integer,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

import { collections } from './collection.schema.js'
import { publications } from './publication.schema.js'

export const collectionItems = pgTable(
  'collection_items',
  {
    id: serial('id').primaryKey(),

    collectionId: integer('collection_id')
      .notNull()
      .references(() => collections.id),

    publicationId: integer('publication_id')
      .notNull()
      .references(() => publications.id),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique('collection_items_unique').on(
      table.collectionId,
      table.publicationId,
    ),
  ],
)
