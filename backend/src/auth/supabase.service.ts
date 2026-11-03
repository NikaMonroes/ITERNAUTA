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
