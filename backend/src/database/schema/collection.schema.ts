import {
  pgEnum,
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core'

import { users } from './user.schema.js'

export const collectionTypeEnum = pgEnum(
  'collection_type',
  [
    'SYSTEM',
    'CUSTOM',
  ],
)

export const collections = pgTable(
  'collections',
  {
    id: serial('id').primaryKey(),

    userId: integer('user_id')
      .notNull()
      .references(() => users.id),

    name: varchar('name', {
      length: 100,
    }).notNull(),

    type: collectionTypeEnum('type')
      .notNull()
      .default('SYSTEM'),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull(),
  },
)