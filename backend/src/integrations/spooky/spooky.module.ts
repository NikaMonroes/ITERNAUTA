import { Module } from '@nestjs/common'

import { SpookyService } from './spooky.service.js'
import { SpookyController } from './spooky.controller.js'

import { JumpsellerClient } from '../jumpseller/jumpseller.client.js'

@Module({
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