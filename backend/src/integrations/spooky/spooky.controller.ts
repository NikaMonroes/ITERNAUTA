import {
  Controller,
  Post,
  Query, //nuevo método de consulta
} from '@nestjs/common'

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { SpookyService } from './spooky.service.js'

@ApiTags('Spooky')
@Controller('spooky')
export class SpookyController {
  constructor(
    private readonly spookyService: SpookyService,
  ) {}

  @Post('sync')
  @ApiOperation({
    summary: 'Sincronizar catálogo de Spooky House',
    description:
      'Obtiene los productos de Spooky House mediante Jumpseller y los sincroniza con el catálogo de ITERNAUTA.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Catálogo de Spooky House sincronizado correctamente.',
  })
  async syncCatalog(
    @Query('limit') limit?: string,
  ) {
    return this.spookyService.syncCatalog(
      limit ? Number(limit) : undefined,
    )
  }
}