import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { series } from './series.schema.js';

export const publications = pgTable('publications', {
  id: serial('id').primaryKey(),

  seriesId: integer('series_id')
    .notNull()
    .references(() => series.id),

  title: varchar('title', { length: 200 })
    .notNull(),

  volume: integer('volume'),

  publisher: varchar('publisher', { length: 150 }),

  isbn: varchar('isbn', { length: 50 }),

  coverUrl: text('cover_url'),

  description: text('description'),

  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
});