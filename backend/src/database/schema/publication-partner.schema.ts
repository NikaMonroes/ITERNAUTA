import {
  pgTable,
  serial,
  integer,
} from 'drizzle-orm/pg-core';

import { publications } from './publication.schema.js';
import { partners } from './partner.schema.js';

export const publicationPartners = pgTable('publication_partners', {
  id: serial('id').primaryKey(),

  publicationId: integer('publication_id')
    .notNull()
    .references(() => publications.id),

  partnerId: integer('partner_id')
    .notNull()
    .references(() => partners.id),
});