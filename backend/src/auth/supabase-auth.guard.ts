import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import type { Request } from 'express'

import { SupabaseService } from './supabase.service.js'

@Injectable()
export class SupabaseAuthGuard
  implements CanActivate
{
  constructor(
    private readonly supabaseService: SupabaseService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<Request>()

    const authorization =
      request.headers.authorization

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException(
        'Token de autenticación requerido',
      )
    }

    const token =
      authorization.substring(7)

    if (!token) {
      throw new UnauthorizedException(
        'Token de autenticación inválido',
      )
    }

    const {
      data: { user },
      error,
    } =
      await this.supabaseService
        .getClient()
        .auth.getUser(token)

    if (error || !user) {
      throw new UnauthorizedException(
        'Token de autenticación inválido o expirado',
      )
    }

    request.user = user

    return true
  }
}