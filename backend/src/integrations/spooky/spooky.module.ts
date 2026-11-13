
import { Module } from '@nestjs/common'

import { SpookyService } from './spooky.service.js'
import { SpookyController } from './spooky.controller.js'

import { JumpsellerClient } from '../jumpseller/jumpseller.client.js'

import { AuthModule } from '../../auth/auth.module.js'
import { UsersModule } from '../../users/users.module.js'

@Module({
  imports: [
    AuthModule,
    UsersModule,
  ],
  controllers: [
    SpookyController,
  ],
  providers: [
    SpookyService,
    JumpsellerClient,
  ],
  exports: [
    SpookyService,
  ],
})
export class SpookyModule {}
