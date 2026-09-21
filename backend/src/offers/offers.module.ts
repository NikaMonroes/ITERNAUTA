import { Module } from '@nestjs/common';
import { OffersService } from './offers.service.js';
import { OffersController } from './offers.controller.js';

@Module({
  providers: [OffersService],
  controllers: [OffersController]
})
export class OffersModule {}
