import {
  createContext,
  useContext,
  useEffect,
  useRef,
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

  const usuarioSincronizado = useRef<string | null>(
    null,
  )

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession)

        if (!newSession) {
          usuarioSincronizado.current = null
          setLoading(false)
          return
        }

        const userId = newSession.user.id

        if (
          usuarioSincronizado.current === userId
        ) {
          setLoading(false)
          return
        }

        if (
          event === 'INITIAL_SESSION' ||
          event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED'
        ) {
          usuarioSincronizado.current = userId

          setTimeout(() => {
            void apiPost('/users')
              .then(() => {
                console.log(
                  'AUTH CONTEXT - USUARIO SINCRONIZADO',
                )
              })
              .catch((error) => {
                usuarioSincronizado.current = null

                console.error(
                  'AUTH CONTEXT - ERROR AL SINCRONIZAR USUARIO:',
                  error,
                )
              })
              .finally(() => {
                setLoading(false)
              })
          }, 0)
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
