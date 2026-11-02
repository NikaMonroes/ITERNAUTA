import { supabase } from './supabase'

//const API_URL = 'http://localhost:3000'
const API_URL = import.meta.env.VITE_API_URL
console.log('API_URL:', API_URL)

async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('API - SESSION:', session)
  console.log(
    'API - SUPABASE URL:',
    import.meta.env.VITE_SUPABASE_URL,
  )

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (session?.access_token) {
    console.log(
      'API - TOKEN PRESENTE:',
      session.access_token.substring(0, 20),
    )

    headers.Authorization = `Bearer ${session.access_token}`
  }

  return headers
}

/*
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
*/
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


// delete


export async function apiDelete<T>(
  endpoint: string,
): Promise<T> {
  const headers = await getAuthHeaders()

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      method: 'DELETE',
      headers,
    },
  )

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: ${response.statusText}`,
    )
  }

  return response.json()
}
export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: body !== undefined
      ? JSON.stringify(body)
      : undefined,
  })

  if (!response.ok) {
    let message = `Error ${response.status}: ${response.statusText}`

    try {
      const data = await response.json()

      if (data?.message) {
        message = data.message
      }
    } catch {
      // Conservamos el mensaje HTTP si la respuesta no contiene JSON.
    }

    throw new Error(message)
  }

  return response.json()
}