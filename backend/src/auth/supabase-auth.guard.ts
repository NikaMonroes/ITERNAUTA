import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { SupabaseService } from './supabase.service.js'

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const authorization = request.headers.authorization

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticación requerido')
    }

    const token = authorization.substring(7)

    const {
      data: { user },
      error,
    } = await this.supabaseService.getClient().auth.getUser(token)

    if (error || !user) {
      throw new UnauthorizedException('Token inválido o expirado')
    }

    request.user = user

    return true
  }
}