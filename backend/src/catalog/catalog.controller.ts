import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common'

import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { CatalogService } from './catalog.service.js'

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly catalogService: CatalogService,
  ) {}

  @Get('test-jumpseller-sku')
  @ApiOperation({
    summary: 'Probar búsqueda de producto por SKU en Jumpseller',
    description:
      'Ejecuta una consulta de prueba contra la API de Jumpseller utilizando un SKU predefinido.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Respuesta obtenida correctamente desde Jumpseller.',
  })
  async testJumpsellerSku() {
    const sku = '9786075783734'

    return this.catalogService.searchProductBySKU(sku)
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Obtener categorías',
    description:
      'Obtiene las categorías disponibles en ITERNAUTA.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías.',
  })
  async getCategories() {
    return this.catalogService.getCategories()
  }

  @Get('series')
  @ApiOperation({
    summary: 'Obtener series',
    description:
      'Obtiene las series registradas en el catálogo de ITERNAUTA.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de series.',
  })
  async getSeries() {
    return this.catalogService.getSeries()
  }

  @Get('publications')
  @ApiOperation({
    summary: 'Consultar publicaciones',
    description:
      'Obtiene publicaciones del catálogo utilizando búsqueda, filtros por categoría y editorial, y paginación.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca publicaciones por título.',
    example: 'One Piece',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filtra publicaciones por categoría.',
    example: 'Manga',
  })
  @ApiQuery({
    name: 'publisher',
    required: false,
    type: String,
    description: 'Filtra publicaciones por editorial.',
    example: 'Panini',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página.',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description:
      'Cantidad de publicaciones por página. El máximo permitido es 100.',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista paginada de publicaciones.',
  })
  async getPublications(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('publisher') publisher?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.catalogService.getPublications(
      search,
      category,
      publisher,
      Number(page),
      Number(limit),
    )
  }

  @Get('publications/:publicationId')
  @ApiOperation({
    summary: 'Obtener detalle de una publicación',
    description:
      'Obtiene una publicación junto con las ofertas disponibles de sus partners.',
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
      'Detalle de la publicación incluyendo las ofertas de los partners.',
  })
  @ApiResponse({
    status: 404,
    description:
      'La publicación solicitada no existe.',
  })
  async getPublicationDetail(
    @Param('publicationId', ParseIntPipe) publicationId: number,
  ) {
    return this.catalogService.getPublicationDetail(
      publicationId,
    )
  }
}