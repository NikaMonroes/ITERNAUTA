import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OffersService } from './offers.service.js';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get('publication/:publicationId')
  findByPublicationId(
    @Param('publicationId', ParseIntPipe) publicationId: number,
  ) {
    return this.offersService.findByPublicationId(publicationId);
  }
}