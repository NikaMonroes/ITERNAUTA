import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  eq,
  ilike,
  count,
  and,
  inArray,
} from 'drizzle-orm';

import {
  categories,
  series,
  publications,
  offers,
  publicationPartners,
  partners,
} from '../database/schema/index.js';

import {
  DATABASE_CONNECTION,
} from '../database/database.provider.js';

import type {
  Database,
} from '../database/database.provider.js';

import {
  JumpsellerClient,
} from '../integrations/jumpseller/jumpseller.client.js';

@Injectable()
export class CatalogService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,

    private readonly jumpsellerClient: JumpsellerClient,
  ) {}

  async searchProductBySKU(sku: string) {
    return this.jumpsellerClient.searchProductBySKU(sku);
  }

  async getCategories() {
    return this.db
      .select()
      .from(categories);
  }

  async getSeries() {
    return this.db
      .select()
      .from(series);
  }

  async getPublications(
  search?: string,
  category?: string,
  publisher?: string,
  page = 1,
  limit = 20,
) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 100);

  const offset = (safePage - 1) * safeLimit;

  const conditions = [];

  if (search) {
    conditions.push(
      ilike(publications.title, `%${search}%`),
    );
  }

  if (category) {
    conditions.push(
      ilike(categories.name, `%${category}%`),
    );
  }

  if (publisher) {
    conditions.push(
      ilike(publications.publisher, `%${publisher}%`),
    );
  }

  const whereCondition =
    conditions.length > 0
      ? and(...conditions)
      : undefined;

  const publicationsResult = await this.db
    .select({
      id: publications.id,
      seriesId: publications.seriesId,
      title: publications.title,
      volume: publications.volume,
      publisher: publications.publisher,
      isbn: publications.isbn,
      coverUrl: publications.coverUrl,
      description: publications.description,
      createdAt: publications.createdAt,
      updatedAt: publications.updatedAt,
    })
    .from(publications)
    .innerJoin(
      series,
      eq(publications.seriesId, series.id),
    )
    .innerJoin(
      categories,
      eq(series.categoryId, categories.id),
    )
    .where(whereCondition)
    .limit(safeLimit)
    .offset(offset);

  const publicationIds =
    publicationsResult.map(
      (publication) => publication.id,
    );

  let offersResult: {
    publicationId: number;
    partner: string;
    partnerSku: string;
    price: number;
    stock: number;
    status: string;
  }[] = [];

  if (publicationIds.length > 0) {
    offersResult = await this.db
      .select({
        publicationId:
          publicationPartners.publicationId,
        partner: partners.name,
        partnerSku: offers.partnerSku,
        price: offers.price,
        stock: offers.stock,
        status: offers.status,
      })
      .from(offers)
      .innerJoin(
        publicationPartners,
        eq(
          offers.publicationPartnerId,
          publicationPartners.id,
        ),
      )
      .innerJoin(
        partners,
        eq(
          publicationPartners.partnerId,
          partners.id,
        ),
      )
      .where(
        inArray(
          publicationPartners.publicationId,
          publicationIds,
        ),
      );
  }

  const data = publicationsResult.map(
    (publication) => ({
      ...publication,

      offers: offersResult.filter(
        (offer) =>
          offer.publicationId === publication.id,
      ).map(
        ({
          publicationId,
          ...offer
        }) => offer,
      ),
    }),
  );

  const totalResult = await this.db
    .select({
      count: count(),
    })
    .from(publications)
    .innerJoin(
      series,
      eq(publications.seriesId, series.id),
    )
    .innerJoin(
      categories,
      eq(series.categoryId, categories.id),
    )
    .where(whereCondition);

  const total = Number(totalResult[0].count);
  const totalPages = Math.ceil(
    total / safeLimit,
  );

  return {
    data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
  };
}

  async getPublicationDetail(
    publicationId: number,
  ) {
    const publicationResult =
      await this.db
        .select()
        .from(publications)
        .where(
          eq(
            publications.id,
            publicationId,
          ),
        );

    if (
      publicationResult.length === 0
    ) {
      throw new NotFoundException(
        `Publication with id ${publicationId} not found`,
      );
    }

    const publication =
      publicationResult[0];

    const publicationOffers =
      await this.db
        .select({
          partner:
            partners.name,
          partnerSku:
            offers.partnerSku,
          price:
            offers.price,
          stock:
            offers.stock,
          status:
            offers.status,
        })
        .from(offers)
        .innerJoin(
          publicationPartners,
          eq(
            offers.publicationPartnerId,
            publicationPartners.id,
          ),
        )
        .innerJoin(
          partners,
          eq(
            publicationPartners.partnerId,
            partners.id,
          ),
        )
        .where(
          eq(
            publicationPartners.publicationId,
            publicationId,
          ),
        )
        .orderBy(offers.price);

    return {
      ...publication,
      offers:
        publicationOffers,
    };
  }
}