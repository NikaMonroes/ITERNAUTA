import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import type { Request } from 'express'
import { UsersService } from './users.service.js'
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard.js'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('identity/:identityProviderId')
  findByIdentityProviderId(
    @Param('identityProviderId') identityProviderId: string,
  ) {
    return this.usersService.findByIdentityProviderId(identityProviderId)
  }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  create(@Req() request: Request) {
    const user = request.user

    if (!user) {
      throw new Error('Usuario autenticado no encontrado')
    }

    return this.usersService.create(
      user.id,
      user.email ?? '',
    )
  }
}