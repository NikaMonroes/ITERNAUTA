import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import type {
  Session,
  User,
} from '@supabase/supabase-js'

import { supabase } from '../lib/supabase'
import { apiPost } from '../lib/api'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  )

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] =
    useState<Session | null>(null)

  const [loading, setLoading] =
    useState(true)

  async function sincronizarUsuario() {
    try {
      await apiPost('/users')

      console.log(
        'AUTH CONTEXT - USUARIO SINCRONIZADO',
      )
    } catch (error) {
      console.error(
        'AUTH CONTEXT - ERROR AL SINCRONIZAR USUARIO:',
        error,
      )
    }
  }

  useEffect(() => {
    async function loadSession() {
      const {
        data,
        error,
      } = await supabase.auth.getSession()

      console.log(
        'AUTH CONTEXT - SESSION:',
        data.session,
      )

      console.log(
        'AUTH CONTEXT - ERROR:',
        error,
      )

      setSession(data.session)

      if (data.session) {
        await sincronizarUsuario()
      }

      setLoading(false)
    }

    loadSession()

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log(
            'AUTH CONTEXT - EVENT:',
            event,
          )

          console.log(
            'AUTH CONTEXT - NEW SESSION:',
            newSession,
          )

          setSession(newSession)

          if (newSession) {
            void sincronizarUsuario()
          }
        },
      )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider',
    )
  }

  return context
}