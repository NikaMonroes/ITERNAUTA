import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { DATABASE_CONNECTION } from '../database/database.provider.js';
import type { Database } from '../database/database.provider.js';



//import { categories, series } from '../database/schema/index.js';

import {
  categories,
  series,
  publications,
  offers,
  publicationPartners,
  partners,
} from '../database/schema/index.js';

import { JumpsellerClient } from '../integrations/jumpseller/jumpseller.client.js';

import { eq, ilike, count, and } from 'drizzle-orm';

@Injectable()
export class CatalogService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,

    private readonly jumpsellerClient: JumpsellerClient,
  ) {}

  // Test method to search for a product by SKU
  async searchProductBySKU(sku: string) {
    return this.jumpsellerClient.searchProductBySKU(sku);
  }

  async getCategories() {
    return this.db.select().from(categories);
  }

  async getSeries() {
    return this.db.select().from(series);
  }

  
  /**
  async getPublications() {
    return this.db.select().from(publications);
  }
    //==========================

  async getPublications(search?: string) {
  if (search) {
    return this.db
      .select()
      .from(publications)
      .where(ilike(publications.title, `%${search}%`));
  }

  return this.db.select().from(publications);
}


async getPublications(
  search?: string,
  page = 1,
  limit = 20,
) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 100);

  const offset = (safePage - 1) * safeLimit;

  const whereCondition = search
    ? ilike(publications.title, `%${search}%`)
    : undefined;

  const data = await this.db
    .select()
    .from(publications)
    .where(whereCondition)
    .limit(safeLimit)
    .offset(offset);

  const totalResult = await this.db
    .select({
      count: count(),
    })
    .from(publications)
    .where(whereCondition);

  const total = Number(totalResult[0].count);
  const totalPages = Math.ceil(total / safeLimit);

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
*/

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
    ilike(categories.name, `%${category}%`)
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

  const data = await this.db
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
  const totalPages = Math.ceil(total / safeLimit);

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



  async getPublicationDetail(publicationId: number) {
  const publicationResult = await this.db
    .select()
    .from(publications)
    .where(eq(publications.id, publicationId));

  if (publicationResult.length === 0) {
  throw new NotFoundException(
    `Publication with id ${publicationId} not found`,
  );
}


  const publication = publicationResult[0];

  const publicationOffers = await this.db
    .select({
      partner: partners.name,
      partnerSku: offers.partnerSku,
      price: offers.price,
      stock: offers.stock,
      status: offers.status,
    })
    .from(offers)
    .innerJoin(
      publicationPartners,
      eq(offers.publicationPartnerId, publicationPartners.id),
    )
    .innerJoin(
      partners,
      eq(publicationPartners.partnerId, partners.id),
    )
    .where(eq(publicationPartners.publicationId, publicationId))
    .orderBy(offers.price);

  return {
    ...publication,
    offers: publicationOffers,
  };

}
}