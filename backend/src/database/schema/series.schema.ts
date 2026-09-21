import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { categories } from './category.schema.js';

export const series = pgTable('series', {
  id: serial('id').primaryKey(),

  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),

  title: varchar('title', { length: 150 })
    .notNull(),

  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
});