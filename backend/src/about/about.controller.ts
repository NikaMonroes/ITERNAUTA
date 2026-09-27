import {
  Controller,
  Get,
} from '@nestjs/common'

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { AboutService } from './about.service.js'

@ApiTags('About')
@Controller('about')
export class AboutController {
  constructor(
    private readonly aboutService: AboutService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener información de ITERNAUTA',
    description:
      'Obtiene información institucional, categorías, funcionamiento y partner inicial de ITERNAUTA.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Información de ITERNAUTA obtenida correctamente.',
  })
  getAbout() {
    return this.aboutService.getAbout()
  }
}