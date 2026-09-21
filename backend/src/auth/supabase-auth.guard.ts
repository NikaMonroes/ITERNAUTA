import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import { SupabaseService } from './supabase.service.js'

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
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

    console.log('AUTHORIZATION HEADER:', authorization)

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Token de autenticación requerido',
      )
    }

    const token = authorization.substring(7)

    console.log(
      'TOKEN RECIBIDO:',
      token.substring(0, 30) + '...',
    )

    const {
      data: { user },
      error,
    } = await this.supabaseService
      .getClient()
      .auth
      .getUser(token)

    console.log('SUPABASE USER:', user)
    console.log('SUPABASE ERROR:', error)

    if (error || !user) {
      throw new UnauthorizedException(
        'Token inválido o expirado',
      )
    }

    request.user = user

    return true
  }
}