import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module.js';
import { DatabaseModule } from './database/database.module.js';
import { OffersModule } from './offers/offers.module.js';

@Module({
  imports: [DatabaseModule, CatalogModule, OffersModule],
})
export class AppModule {}