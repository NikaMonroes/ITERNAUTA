import { supabase } from './supabase'

const API_URL = 'http://localhost:3000'

async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`
  }

  return headers
}

export async function apiGet<T>(
  endpoint: string,
): Promise<T> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: ${response.statusText}`,
    )
  }

  return response.json()
}