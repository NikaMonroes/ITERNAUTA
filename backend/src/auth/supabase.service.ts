import { Injectable } from '@nestjs/common'
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient

  constructor() {
    const url = process.env.SUPABASE_URL
    const secretKey =
      process.env.SUPABASE_SECRET_KEY

    if (!url || !secretKey) {
      throw new Error(
        'Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en las variables de entorno',
      )
    }

    this.client = createClient(
      url,
      secretKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      },
    )
  }

  getClient(): SupabaseClient {
    return this.client
  }
}
/*
import { Injectable } from '@nestjs/common'
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient

  constructor() {
    const url = process.env.SUPABASE_URL
    const publishableKey =
      process.env.SUPABASE_PUBLISHABLE_KEY

    if (!url || !publishableKey) {
      throw new Error(
        'Faltan SUPABASE_URL o SUPABASE_PUBLISHABLE_KEY en el archivo .env',
      )
    }

    this.client = createClient(
      url,
      publishableKey,
    )
  }

  getClient(): SupabaseClient {
    return this.client
  }
}
  */