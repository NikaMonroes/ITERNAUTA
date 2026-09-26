import { Module } from '@nestjs/common'

import { CollectionsController } from './collections.controller.js'
import { CollectionsService } from './collections.service.js'

import { UsersModule } from '../users/users.module.js'
import { AuthModule } from '../auth/auth.module.js'
import { PlanModule } from '../plan/plan.module.js'

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PlanModule,
  ],
  controllers: [
    CollectionsController,
  ],
  providers: [
    CollectionsService,
  ],
})
export class CollectionsModule {}