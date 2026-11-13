
import {
  Controller,
  Post,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger'

import { SpookyService } from './spooky.service.js'
import { SupabaseAuthGuard } from '../../auth/supabase-auth.guard.js'
import { RolesGuard } from '../../authorization/roles.guard.js'
import { Roles } from '../../auth/decorators/roles.decorator.js'

@ApiTags('Spooky')
@ApiBearerAuth('access-token')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('spooky')
@ApiResponse({
  status: 400,
  description: 'El parámetro limit debe ser un entero positivo.',
})

export class SpookyController {
  constructor(
    private readonly spookyService: SpookyService,
  ) {}

  @Post('sync')
  @ApiOperation({
    summary: 'Sincronizar catálogo de Spooky House',
    description:
      'Obtiene los productos de Spooky House mediante Jumpseller y los sincroniza con el catálogo de ITERNAUTA. Requiere rol SUPER_ADMIN.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Catálogo de Spooky House sincronizado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'Usuario no autenticado o token inválido.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene permisos suficientes.',
  })
  async syncCatalog(
    @Query('limit') limit?: string,
  ) {
    if (limit !== undefined) {
      const parsedLimit = Number(limit)

      if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit <= 0
      ) {
        throw new BadRequestException(
          'El parámetro limit debe ser un entero positivo.',
        )
      }

      return this.spookyService.syncCatalog(parsedLimit)
    }

    return this.spookyService.syncCatalog()
  }
  }
