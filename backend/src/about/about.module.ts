import { Module } from '@nestjs/common'

import { AboutController } from './about.controller.js'
import { AboutService } from './about.service.js'

@Module({
  controllers: [
    AboutController,
  ],

  providers: [
    AboutService,
  ],

  exports: [
    AboutService,
  ],
})
export class AboutModule {}