import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'

import { DATABASE_CONNECTION } from '../database/database.provider.js'
import type { Database } from '../database/database.provider.js'

import { partners } from '../database/schema/index.js'

@Injectable()
export class PartnersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async findAll() {
    return this.db
      .select()
      .from(partners)
  }

  async findById(id: number) {
    const result = await this.db
      .select()
      .from(partners)
      .where(eq(partners.id, id))

    if (result.length === 0) {
      throw new NotFoundException(
        `Partner con id ${id} no encontrado`,
      )
    }

    return result[0]
  }
}
