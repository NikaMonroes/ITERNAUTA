import { Module } from '@nestjs/common'

import { CollectionsController } from './collections.controller.js'
import { CollectionsService } from './collections.service.js'

import { UsersModule } from '../users/users.module.js'
import { AuthModule } from '../auth/auth.module.js'

@Module({
  imports: [
    UsersModule,
    AuthModule,
  ],
  controllers: [
    CollectionsController,
  ],
  providers: [
    CollectionsService,
  ],
})
export class CollectionsModule {}