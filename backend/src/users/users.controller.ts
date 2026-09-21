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
import type { Request } from 'express'

import { UsersService } from './users.service.js'
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard.js'
import { Roles } from '../auth/decorators/roles.decorator.js'
import { RolesGuard } from '../authorization/roles.guard.js'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
      await this.usersService.findByIdentityProviderId(user.id)

    if (!localUser) {
      throw new NotFoundException(
        'Usuario no registrado en ITERNAUTA',
      )
    }

    return localUser
  }

  @Get('identity/:identityProviderId')
  findByIdentityProviderId(
    @Param('identityProviderId') identityProviderId: string,
  ) {
    return this.usersService.findByIdentityProviderId(
      identityProviderId,
    )
  }

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

  @Get('admin-test')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  adminTest() {
    return {
      message: 'Acceso autorizado para SUPER_ADMIN',
    }
  }
}