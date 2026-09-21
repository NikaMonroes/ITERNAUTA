import {
  pgTable,
  serial,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';

export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 150 })
    .notNull()
    .unique(),

  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
});