import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  count,
  eq,
} from 'drizzle-orm'

import {
  DATABASE_CONNECTION,
} from '../database/database.provider.js'

import type {
  Database,
} from '../database/database.provider.js'

import {
  collectionItems,
  collections,
} from '../database/schema/index.js'

import {
  UsersService,
} from '../users/users.service.js'

@Injectable()
export class PlanService {
  private readonly FREE_STORAGE_LIMIT = 100

  constructor(
    private readonly usersService: UsersService,

    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async getMyPlan(
    identityProviderId: string,
  ) {
    const user =
      await this.usersService.findByIdentityProviderId(
        identityProviderId,
      )

    if (!user) {
      throw new NotFoundException(
        'Usuario no registrado en ITERNAUTA',
      )
    }

    const used =
      await this.getUsedStorage(user.id)

    const limit =
      this.FREE_STORAGE_LIMIT

    const available = Math.max(
      0,
      limit - used,
    )

    return {
      plan: 'FREE',

      storage: {
        limit,
        used,
        available,
      },

      features: {
        customCollections: false,
      },
    }
  }

  async canAddPublication(
    identityProviderId: string,
  ) {
    const user =
      await this.usersService.findByIdentityProviderId(
        identityProviderId,
      )

    if (!user) {
      throw new NotFoundException(
        'Usuario no registrado en ITERNAUTA',
      )
    }

    const used =
      await this.getUsedStorage(user.id)

    const limit =
      this.FREE_STORAGE_LIMIT

    return {
      allowed: used < limit,
      used,
      limit,
      available: Math.max(
        0,
        limit - used,
      ),
    }
  }

  private async getUsedStorage(
    userId: number,
  ) {
    const result = await this.db
      .select({
        count: count(),
      })
      .from(collectionItems)
      .innerJoin(
        collections,
        eq(
          collectionItems.collectionId,
          collections.id,
        ),
      )
      .where(
        eq(
          collections.userId,
          userId,
        ),
      )

    return Number(
      result[0]?.count ?? 0,
    )
  }
}