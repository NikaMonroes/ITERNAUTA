import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { and, eq } from 'drizzle-orm'

import { DATABASE_CONNECTION } from '../database/database.provider.js'
import type { Database } from '../database/database.provider.js'
// import de PlanService
import { PlanService } from '../plan/plan.service.js'

import {
  collectionItems,
  collections,
  publications,
  series,
  categories,
} from '../database/schema/index.js'

import { UsersService } from '../users/users.service.js'

@Injectable()
export class CollectionsService {
  constructor(
    private readonly usersService: UsersService,
    // PlanService
    private readonly planService: PlanService,

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

    const storage =
      await this.planService.canAddPublication(
        identityProviderId,
      )

    if (!storage.allowed) {
      throw new ConflictException(
        'Has alcanzado el límite de almacenamiento de tu plan. Actualiza tu plan para guardar más publicaciones.',
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

    categoryId: categories.id,
    category: categories.name,
  })
  .from(collectionItems)
  .innerJoin(
    publications,
    eq(
      collectionItems.publicationId,
      publications.id,
    ),
  )
  .innerJoin(
    series,
    eq(
      publications.seriesId,
      series.id,
    ),
  )
  .innerJoin(
    categories,
    eq(
      series.categoryId,
      categories.id,
    ),
  )
  .where(
    eq(
      collectionItems.collectionId,
      collectionId,
    ),
  )
  }




  // delete publication de Mi coleccion

  async removePublication(
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

  if (!existingItem[0]) {
    throw new NotFoundException(
      'La publicación no está en esta colección',
    )
  }

  await this.db
    .delete(collectionItems)
    .where(
      eq(
        collectionItems.id,
        existingItem[0].id,
      ),
    )

  return {
    message:
      'Publicación eliminada de la colección',
  }
}
}