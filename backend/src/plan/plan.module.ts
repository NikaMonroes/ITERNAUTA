import { Module } from '@nestjs/common'

import { PlanController } from './plan.controller.js'
import { PlanService } from './plan.service.js'

import { AuthModule } from '../auth/auth.module.js'
import { UsersModule } from '../users/users.module.js'

@Module({
  imports: [
    AuthModule,
    UsersModule,
  ],
  controllers: [
    PlanController,
  ],
  providers: [
    PlanService,
  ],
})
export class PlanModule {}