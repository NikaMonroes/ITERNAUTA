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

import { PartnersService } from './partners.service.js'

@ApiTags('Partners')
@Controller('partners')
export class PartnersController {
  constructor(
    private readonly partnersService: PartnersService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener partners',
    description:
      'Obtiene la lista de partners registrados en ITERNAUTA.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de partners.',
  })
  findAll() {
    return this.partnersService.findAll()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener partner por ID',
    description:
      'Obtiene la información de un partner específico.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del partner.',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Partner encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Partner no encontrado.',
  })
  findById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.partnersService.findById(id)
  }
}
