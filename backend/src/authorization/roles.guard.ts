import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import { UsersService } from '../users/users.service.js'
import { ROLES_KEY } from '../auth/decorators/roles.decorator.js'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    // Si la ruta no exige ningún rol,
    // no bloqueamos el acceso.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()

    // SupabaseAuthGuard debe haber autenticado previamente al usuario.
    const supabaseUser = request.user

    if (!supabaseUser) {
      throw new ForbiddenException('Usuario no autenticado')
    }

    // Buscamos el usuario local de ITERNAUTA
    // utilizando el ID que viene de Supabase.
    const localUser =
      await this.usersService.findByIdentityProviderId(
        supabaseUser.id,
      )

    if (!localUser) {
      throw new ForbiddenException(
        'Usuario no registrado en ITERNAUTA',
      )
    }

    // Comprobamos si el rol del usuario está
    // dentro de los roles permitidos para la ruta.
    if (!requiredRoles.includes(localUser.role)) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso',
      )
    }

    return true
  }
}