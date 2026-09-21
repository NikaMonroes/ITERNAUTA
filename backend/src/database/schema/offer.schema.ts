import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';

import { publicationPartners } from './publication-partner.schema.js';

export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),

  publicationPartnerId: integer('publication_partner_id')
    .notNull()
    .references(() => publicationPartners.id),

  partnerSku: varchar('partner_sku', { length: 100 })
    .notNull(),

  price: integer('price')
    .notNull(),

  stock: integer('stock')
    .notNull()
    .default(0),

  status: varchar('status', { length: 30 })
    .notNull(),

  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
});