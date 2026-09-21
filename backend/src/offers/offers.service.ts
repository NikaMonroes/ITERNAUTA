import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.provider.js';
import type { Database } from '../database/database.provider.js';
import {
  offers,
  publicationPartners,
  publications,
  partners,
} from '../database/schema/index.js';

@Injectable()
export class OffersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async findAll() {
    return this.db
      .select({
        publication: publications.title,
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
        publications,
        eq(publicationPartners.publicationId, publications.id),
      )
      .innerJoin(
        partners,
        eq(publicationPartners.partnerId, partners.id),
      )
      .orderBy(offers.price);
  }

  async findByPublicationId(publicationId: number) {
    return this.db
      .select({
        publication: publications.title,
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
        publications,
        eq(publicationPartners.publicationId, publications.id),
      )
      .innerJoin(
        partners,
        eq(publicationPartners.partnerId, partners.id),
      )
      .where(eq(publicationPartners.publicationId, publicationId))
      .orderBy(offers.price);
  }
}