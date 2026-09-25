import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { and, eq } from 'drizzle-orm'

import { DATABASE_CONNECTION } from '../database/database.provider.js'
import type { Database } from '../database/database.provider.js'

import {
  collectionItems,
  collections,
  publications,
} from '../database/schema/index.js'

import { UsersService } from '../users/users.service.js'

@Injectable()
export class CollectionsService {
  constructor(
    private readonly usersService: UsersService,

    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async findMyCollections(
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

    return this.db
      .select()
      .from(collections)
      .where(
        eq(
          collections.userId,
          user.id,
        ),
      )
  }

  async addPublication(
    identityProviderId: string,
    collectionId: number,
    publicationId: number,
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

    const collection = await this.db
      .select()
      .from(collections)
      .where(
        and(
          eq(
            collections.id,
            collectionId,
          ),
          eq(
            collections.userId,
            user.id,
          ),
        ),
      )
      .limit(1)

    if (!collection[0]) {
      throw new NotFoundException(
        'Colección no encontrada',
      )
    }

    const publication = await this.db
      .select()
      .from(publications)
      .where(
        eq(
          publications.id,
          publicationId,
        ),
      )
      .limit(1)

    if (!publication[0]) {
      throw new NotFoundException(
        'Publicación no encontrada',
      )
    }

    const existingItem = await this.db
      .select()
      .from(collectionItems)
      .where(
        and(
          eq(
            collectionItems.collectionId,
            collectionId,
          ),
          eq(
            collectionItems.publicationId,
            publicationId,
          ),
        ),
      )
      .limit(1)

    if (existingItem[0]) {
      throw new ConflictException(
        'La publicación ya está en esta colección',
      )
    }

    const result = await this.db
      .insert(collectionItems)
      .values({
        collectionId,
        publicationId,
      })
      .returning()

    return result[0]
  }
  
  async findCollectionItems(
  identityProviderId: string,
  collectionId: number,
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

  const collection = await this.db
    .select()
    .from(collections)
    .where(
      and(
        eq(collections.id, collectionId),
        eq(collections.userId, user.id),
      ),
    )
    .limit(1)

  if (!collection[0]) {
    throw new NotFoundException(
      'Colección no encontrada',
    )
  }

  return this.db
    .select({
      id: collectionItems.id,
      collectionId: collectionItems.collectionId,
      publicationId: publications.id,
      title: publications.title,
      volume: publications.volume,
      publisher: publications.publisher,
      isbn: publications.isbn,
      coverUrl: publications.coverUrl,
      description: publications.description,
      addedAt: collectionItems.createdAt,
    })
    .from(collectionItems)
    .innerJoin(
      publications,
      eq(
        collectionItems.publicationId,
        publications.id,
      ),
    )
    .where(
      eq(
        collectionItems.collectionId,
        collectionId,
      ),
    )
}

}