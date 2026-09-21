import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import {
  categories,
  series,
  publications,
  partners,
  publicationPartners,
  offers,
} from '../../database/schema/index.js';

import {
  DATABASE_CONNECTION,
} from '../../database/database.provider.js';

import type {
  Database,
} from '../../database/database.provider.js';

import { JumpsellerClient } from '../jumpseller/jumpseller.client.js';

import {
  SpookyAdapter,
} from './spooky.adapter.js';

@Injectable()
export class SpookyService {
  private readonly adapter: SpookyAdapter;

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,

    private readonly jumpsellerClient: JumpsellerClient,
  ) {
    this.adapter = new SpookyAdapter();
  }
/**
 * async syncCatalog(limit?: number) {
    const products =
      await this.jumpsellerClient.getAllProducts();

    const productsToSync =
      limit && limit > 0
        ? products.slice(0, limit)
        : products;
 */
  
async syncCatalog(limit?: number) {
  const products =
    limit && limit > 0
      ? await this.jumpsellerClient.getProducts(limit)
      : await this.jumpsellerClient.getAllProducts();

  const productsToSync = products;
  
    const results = {
      requested: limit ?? 'all',
      available: products.length,
      processed: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const product of productsToSync) {
      try {
        const normalized =
          this.adapter.normalize(product);

        await this.syncProduct(
          normalized,
          results,
        );

        results.processed++;
      } catch (error) {
        results.errors.push(
          error instanceof Error
            ? error.message
            : `Error procesando producto ${product.id}`,
        );
      }
    }

    return {
      message:
        'Sincronización de Spooky completada.',
      ...results,
    };
  }

  private async syncProduct(
    normalized: ReturnType<
      SpookyAdapter['normalize']
    >,
    results: {
      created: number;
      updated: number;
      skipped: number;
    },
  ) {
    const {
      publication,
      offer,
    } = normalized;

    /*
     * 1. Buscar o crear categoría
     */
    const categoryResult =
      await this.db
        .select()
        .from(categories)
        .where(
          eq(
            categories.name,
            publication.category,
          ),
        )
        .limit(1);

    let categoryId: number;

    if (categoryResult.length > 0) {
      categoryId = categoryResult[0].id;
    } else {
      const inserted =
        await this.db
          .insert(categories)
          .values({
            name: publication.category,
          })
          .returning();

      categoryId = inserted[0].id;
    }

    /*
     * 2. Buscar o crear serie
     */
    const seriesResult =
      await this.db
        .select()
        .from(series)
        .where(
          eq(
            series.title,
            publication.seriesTitle,
          ),
        )
        .limit(1);

    let seriesId: number;

    if (seriesResult.length > 0) {
      seriesId = seriesResult[0].id;
    } else {
      const inserted =
        await this.db
          .insert(series)
          .values({
            categoryId,
            title: publication.seriesTitle,
          })
          .returning();

      seriesId = inserted[0].id;
    }

    /*
     * 3. Buscar o crear publicación por ISBN
     *
     * Regla de dominio:
     * SKU de Spooky = ISBN de ITERNAUTA.
     */
    let publicationId: number;

    if (publication.isbn) {
      const publicationResult =
        await this.db
          .select()
          .from(publications)
          .where(
            eq(
              publications.isbn,
              publication.isbn,
            ),
          )
          .limit(1);

      if (publicationResult.length > 0) {
        publicationId =
          publicationResult[0].id;

        await this.db
          .update(publications)
          .set({
            seriesId,
            title: publication.title,
            volume: publication.volume,
            publisher: publication.publisher,
            coverUrl: publication.coverUrl,
            description:
              publication.description,
            updatedAt: new Date(),
          })
          .where(
            eq(
              publications.id,
              publicationId,
            ),
          );

        results.updated++;
      } else {
        const inserted =
          await this.db
            .insert(publications)
            .values({
              seriesId,
              title: publication.title,
              volume: publication.volume,
              publisher: publication.publisher,
              isbn: publication.isbn,
              coverUrl: publication.coverUrl,
              description:
                publication.description,
            })
            .returning();

        publicationId = inserted[0].id;

        results.created++;
      }
    } else {
      /*
       * Productos sin SKU/ISBN.
       */
      const publicationResult =
        await this.db
          .select()
          .from(publications)
          .where(
            eq(
              publications.title,
              publication.title,
            ),
          )
          .limit(1);

      if (publicationResult.length > 0) {
        publicationId =
          publicationResult[0].id;

        results.skipped++;
      } else {
        const inserted =
          await this.db
            .insert(publications)
            .values({
              seriesId,
              title: publication.title,
              volume: publication.volume,
              publisher: publication.publisher,
              isbn: null,
              coverUrl: publication.coverUrl,
              description:
                publication.description,
            })
            .returning();

        publicationId = inserted[0].id;

        results.created++;
      }
    }

    /*
     * 4. Buscar o crear partner Spooky House
     */
    const partnerResult =
      await this.db
        .select()
        .from(partners)
        .where(
          eq(
            partners.name,
            'Spooky House',
          ),
        )
        .limit(1);

    let partnerId: number;

    if (partnerResult.length > 0) {
      partnerId = partnerResult[0].id;
    } else {
      const inserted =
        await this.db
          .insert(partners)
          .values({
            name: 'Spooky House',
          })
          .returning();

      partnerId = inserted[0].id;
    }

    /*
     * 5. Buscar o crear relación
     * publication ↔ partner
     */
    const publicationPartnerResult =
      await this.db
        .select()
        .from(publicationPartners)
        .where(
          eq(
            publicationPartners.publicationId,
            publicationId,
          ),
        )
        .limit(1);

    let publicationPartnerId: number;

    const existingRelation =
      publicationPartnerResult.find(
        (item) =>
          item.partnerId === partnerId,
      );

    if (existingRelation) {
      publicationPartnerId =
        existingRelation.id;
    } else {
      const inserted =
        await this.db
          .insert(publicationPartners)
          .values({
            publicationId,
            partnerId,
          })
          .returning();

      publicationPartnerId =
        inserted[0].id;
    }

    /*
     * 6. Buscar o crear oferta
     */
    const offerResult =
      await this.db
        .select()
        .from(offers)
        .where(
          eq(
            offers.publicationPartnerId,
            publicationPartnerId,
          ),
        )
        .limit(1);

    if (offerResult.length > 0) {
      await this.db
        .update(offers)
        .set({
          partnerSku:
            offer.partnerSku ?? '',
          price: offer.price,
          stock: offer.stock,
          status: offer.status,
          updatedAt: new Date(),
        })
        .where(
          eq(
            offers.id,
            offerResult[0].id,
          ),
        );
    } else {
      await this.db
        .insert(offers)
        .values({
          publicationPartnerId,
          partnerSku:
            offer.partnerSku ?? '',
          price: offer.price,
          stock: offer.stock,
          status: offer.status,
        });
    }
  }
}