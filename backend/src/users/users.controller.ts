import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  Body,
  BadRequestException,
  Patch,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
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
  summary: 'Actualizar alias del usuario autenticado',
  description:
    'Permite establecer, modificar o eliminar el alias del usuario autenticado.',
})
@ApiResponse({
  status: 200,
  description: 'Alias actualizado correctamente.',
})
@ApiResponse({
  status: 400,
  description: 'El alias no es válido o supera los 20 caracteres.',
})
@ApiResponse({
  status: 401,
  description: 'Token de autenticación requerido o inválido.',
})
@ApiResponse({
  status: 404,
  description: 'Usuario no registrado en ITERNAUTA.',
})

@ApiBody({
  schema: {
    type: 'object',
    properties: {
      alias: {
        type: 'string',
        nullable: true,
        maxLength: 20,
        example: 'Moni',
      },
    },
    required: ['alias'],
  },
})


@Patch('me')
@UseGuards(SupabaseAuthGuard)
async updateMe(
  @Req() request: Request,
  @Body() body: { alias?: unknown },
) {
  const user = request.user

  if (!user) {
    throw new UnauthorizedException(
      'Usuario autenticado no encontrado',
    )
  }

if (
  !body ||
  typeof body !== 'object' ||
  Array.isArray(body)
) {
  throw new BadRequestException(
    'El cuerpo de la solicitud no es válido.',
  )
}


  if (
    body.alias === undefined ||
    (
      body.alias !== null &&
      typeof body.alias !== 'string'
    )
  ) {
    throw new BadRequestException(
      'Debes proporcionar un alias válido.',
    )
  }

  const alias =
    typeof body.alias === 'string'
      ? body.alias.trim()
      : null

  if (
    alias !== null &&
    Array.from(alias).length > 20
  ) {
    throw new BadRequestException(
      'El alias no puede superar los 20 caracteres.',
    )
  }

  const updatedUser =
    await this.usersService.updateAlias(
      user.id,
      alias || null,
    )

  if (!updatedUser) {
    throw new NotFoundException(
      'Usuario no registrado en ITERNAUTA',
    )
  }

  return updatedUser
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