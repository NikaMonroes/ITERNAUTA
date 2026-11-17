import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', [
  'CLIENT',
  'ORGANIZER',
  'PARTNER',
  'SUPER_ADMIN',
])

export const userPlanEnum = pgEnum('user_plan', [
  'FREE',
  'PREMIUM',
])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  identityProviderId: varchar('identity_provider_id', {
    length: 255,
  }).notNull().unique(),

  email: varchar('email', {
    length: 255,
  }).notNull().unique(),

  alias: varchar('alias', {
    length: 20,
  }),

  role: userRoleEnum('role')
    .notNull()
    .default('CLIENT'),

  plan: userPlanEnum('plan')
    .notNull()
    .default('FREE'),

  createdAt: timestamp('created_at')
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow(),
})
