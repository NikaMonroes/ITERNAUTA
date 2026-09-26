import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'

import type { Request } from 'express'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { PlanService } from './plan.service.js'
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard.js'

@ApiTags('Plan')
@ApiBearerAuth('access-token')
@Controller('plan')
export class PlanController {
  constructor(
    private readonly planService: PlanService,
  ) {}

  @Get('me')
@UseGuards(SupabaseAuthGuard)
@ApiOperation({
  summary: 'Obtener mi plan',
  description:
    'Obtiene el plan, capacidad de almacenamiento y funcionalidades disponibles para el usuario autenticado.',
})
@ApiResponse({
  status: 200,
  description:
    'Información del plan obtenida correctamente.',
})
@ApiResponse({
  status: 401,
  description:
    'Token de autenticación requerido o inválido.',
})
async getMyPlan(
  @Req() request: Request,
) {
  const user = request.user

  if (!user) {
    throw new UnauthorizedException(
      'Usuario autenticado no encontrado',
    )
  }

  return this.planService.getMyPlan(
    user.id,
  )
}
}