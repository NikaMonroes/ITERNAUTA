import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common'

import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { OffersService } from './offers.service.js'

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
  ) {}

  @ApiOperation({
    summary: 'Obtener todas las ofertas',
    description:
      'Obtiene las ofertas disponibles de las publicaciones registradas en ITERNAUTA, ordenadas por precio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ofertas disponibles.',
  })
  @Get()
  findAll() {
    return this.offersService.findAll()
  }

  @ApiOperation({
    summary: 'Obtener ofertas de una publicación',
    description:
      'Obtiene las ofertas disponibles de los diferentes partners para una publicación específica.',
  })
  @ApiParam({
    name: 'publicationId',
    type: Number,
    description: 'ID de la publicación.',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de ofertas disponibles para la publicación.',
  })
  @Get('publication/:publicationId')
  findByPublicationId(
    @Param('publicationId', ParseIntPipe)
    publicationId: number,
  ) {
    return this.offersService.findByPublicationId(
      publicationId,
    )
  }
}