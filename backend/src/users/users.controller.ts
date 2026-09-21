import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import type { Request } from 'express'

import { UsersService } from './users.service.js'
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard.js'
import { Roles } from '../auth/decorators/roles.decorator.js'
import { RolesGuard } from '../authorization/roles.guard.js'

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({
    summary: 'Obtener usuario autenticado',
    description:
      'Obtiene el usuario local de ITERNAUTA asociado al usuario autenticado mediante Supabase.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado encontrado.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación requerido o inválido.',
  })
  @ApiResponse({
    status: 404,
    description: 'El usuario no está registrado en ITERNAUTA.',
  })
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  async me(@Req() request: Request) {
    const user = request.user

    if (!user) {
      throw new UnauthorizedException(
        'Usuario autenticado no encontrado',
      )
    }

    const localUser =
      await this.usersService.findByIdentityProviderId(
        user.id,
      )

    if (!localUser) {
      throw new NotFoundException(
        'Usuario no registrado en ITERNAUTA',
      )
    }

    return localUser
  }

  @ApiOperation({
    summary: 'Buscar usuario por proveedor de identidad',
    description:
      'Busca un usuario local mediante su identificador de Supabase.',
  })
  @ApiParam({
    name: 'identityProviderId',
    type: String,
    description:
      'Identificador del usuario en el proveedor de identidad.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado o null si no existe.',
  })
  @Get('identity/:identityProviderId')
  findByIdentityProviderId(
    @Param('identityProviderId')
    identityProviderId: string,
  ) {
    return this.usersService.findByIdentityProviderId(
      identityProviderId,
    )
  }

  @ApiOperation({
    summary: 'Crear usuario local',
    description:
      'Crea el registro del usuario autenticado en la base de datos de ITERNAUTA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación requerido o inválido.',
  })
  @Post()
  @UseGuards(SupabaseAuthGuard)
  async create(@Req() request: Request) {
    const user = request.user

    if (!user) {
      throw new UnauthorizedException(
        'Usuario autenticado no encontrado',
      )
    }

    return this.usersService.create(
      user.id,
      user.email ?? '',
    )
  }

  @ApiOperation({
    summary: 'Probar acceso de administrador',
    description:
      'Endpoint de prueba protegido mediante autenticación y autorización por rol. Requiere SUPER_ADMIN.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Acceso autorizado para SUPER_ADMIN.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description:
      'El usuario no tiene el rol SUPER_ADMIN.',
  })
  @Get('admin-test')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  adminTest() {
    return {
      message:
        'Acceso autorizado para SUPER_ADMIN',
    }
  }
}