import {
  Inject,
  Injectable,
} from '@nestjs/common'

import {
  and,
  eq,
} from 'drizzle-orm'

import {
  DATABASE_CONNECTION,
} from '../database/database.provider.js'

import type {
  Database,
} from '../database/database.provider.js'

import {
  users,
  collections,
} from '../database/schema/index.js'

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async findByIdentityProviderId(
    identityProviderId: string,
  ) {
    const result = await this.db
      .select()
      .from(users)
      .where(
        eq(
          users.identityProviderId,
          identityProviderId,
        ),
      )
      .limit(1)

    return result[0] ?? null
  }

  async create(
    identityProviderId: string,
    email: string,
  ) {
    let user =
      await this.findByIdentityProviderId(
        identityProviderId,
      )

    if (!user) {
      const result = await this.db
        .insert(users)
        .values({
          identityProviderId,
          email,
        })
        .returning()

      user = result[0]

      if (!user) {
        throw new Error(
          'No fue posible crear el usuario',
        )
      }
    }

    await this.ensureDefaultCollections(
      user.id,
    )

    return user
  }

  private async ensureDefaultCollections(
    userId: number,
  ) {
    const defaultCollections = [
      'Manga',
      'Cómic',
    ]

    for (const name of defaultCollections) {
      const existingCollection =
        await this.db
          .select()
          .from(collections)
          .where(
            and(
              eq(
                collections.userId,
                userId,
              ),
              eq(
                collections.name,
                name,
              ),
            ),
          )
          .limit(1)

      if (!existingCollection[0]) {
        await this.db
          .insert(collections)
          .values({
            userId,
            name,
            type: 'SYSTEM',
          })
      }
    }
  }
}