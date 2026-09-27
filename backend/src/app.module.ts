import { Module } from '@nestjs/common'
import { CatalogModule } from './catalog/catalog.module.js'
import { DatabaseModule } from './database/database.module.js'
import { OffersModule } from './offers/offers.module.js'
import { UsersModule } from './users/users.module.js'
import { AuthModule } from './auth/auth.module.js'
import { PartnersModule } from './partners/partners.module.js'
import { SpookyModule } from './integrations/spooky/spooky.module.js'
import { CollectionsModule } from './collections/collections.module.js'
import { PlanModule } from './plan/plan.module.js'
import { AboutModule } from './about/about.module.js'


@Module({
  imports: [
    DatabaseModule,
    CatalogModule,
    OffersModule,
    UsersModule,
    AuthModule,
    PartnersModule,
    SpookyModule,
    CollectionsModule,
    PlanModule,
    AboutModule,
  ],
})
export class AppModule {}