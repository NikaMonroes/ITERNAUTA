import { Module } from '@nestjs/common'
import { SupabaseService } from './supabase.service.js'
import { SupabaseAuthGuard } from './supabase-auth.guard.js'

@Module({
  providers: [SupabaseService, SupabaseAuthGuard],
  exports: [SupabaseService, SupabaseAuthGuard],
})
export class AuthModule {}