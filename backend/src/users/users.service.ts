import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DATABASE_CONNECTION } from '../database/database.provider.js'
import type { Database } from '../database/database.provider.js'
import { users } from '../database/schema/index.js'

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async findByIdentityProviderId(identityProviderId: string) {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.identityProviderId, identityProviderId))
      .limit(1)

    return result[0] ?? null
  }

  async create(
    identityProviderId: string,
    email: string,
  ) {
    const result = await this.db
      .insert(users)
      .values({
        identityProviderId,
        email,
      })
      .returning()

    return result[0]
  }
}