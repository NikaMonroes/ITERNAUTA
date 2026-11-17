import { useEffect, useState } from 'react'

import { apiGet, apiPatch } from '../../lib/api'
import { supabase } from '../../lib/supabase'

import './Profile.css'

interface UserProfile {
  email: string
  alias: string | null
  role: string
  plan: 'FREE' | 'PREMIUM'
}

function Profile() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null)

  const [alias, setAlias] = useState('')

  const [loading, setLoading] = useState(true)
  const [savingAlias, setSavingAlias] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const response =
          await apiGet<UserProfile>('/users/me')

        setProfile(response)
        setAlias(response.alias ?? '')
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible cargar tu perfil.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  async function handleUpdateAlias(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setMessage('')
    setSavingAlias(true)

    try {
      const updatedProfile =
        await apiPatch<UserProfile>(
          '/users/me',
          { alias },
        )

      setProfile(updatedProfile)
      setAlias(updatedProfile.alias ?? '')
      setMessage('Tu alias se actualizó correctamente.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible actualizar tu alias.',
      )
    } finally {
      setSavingAlias(false)
    }
  }

  async function handleChangePassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (!newPassword.trim()) {
      setError('Debes escribir una nueva contraseña.')
      return
    }

    setSavingPassword(true)

    try {
      const { error: passwordError } =
        await supabase.auth.updateUser({
          password: newPassword,
        })

      if (passwordError) {
        throw passwordError
      }

      setNewPassword('')
      setConfirmPassword('')
      setMessage('Tu contraseña se actualizó correctamente.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible actualizar tu contraseña.',
      )
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-state">
        Cargando tu perfil...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-error">
        {error || 'No fue posible cargar tu perfil.'}
      </div>
    )
  }

  return (
    <section className="profile-page">
      <header className="profile-header">
        <span className="profile-kicker">
          MI CUENTA
        </span>

        <h1>Mi perfil</h1>

        <p>
          Administra tu información personal y tus
          opciones de acceso a ITERNAUTA.
        </p>
      </header>

      {message && (
        <div className="profile-message">
          {message}
        </div>
      )}

      {error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      <div className="profile-card">
        <div className="profile-section-heading">
          <h2>Información personal</h2>
          <p>Estos datos identifican tu cuenta en ITERNAUTA.</p>
        </div>

        <div className="profile-field">
          <label htmlFor="profile-email">
            Correo electrónico
          </label>

          <input
            id="profile-email"
            type="email"
            value={profile.email}
            disabled
          />

          <small>
            Tu correo está asociado a tu cuenta de Supabase.
          </small>
        </div>

        <form onSubmit={handleUpdateAlias}>
          <div className="profile-field">
            <label htmlFor="profile-alias">
              Alias <span>(opcional)</span>
            </label>

            <input
              id="profile-alias"
              type="text"
              value={alias}
              onChange={(event) =>
                setAlias(event.target.value)
              }
              maxLength={20}
              placeholder="¿Cómo quieres que te llamemos?"
            />

            <small>
              Máximo 20 caracteres. Puedes dejarlo vacío.
            </small>
          </div>

          <button
            type="submit"
            className="profile-button"
            disabled={savingAlias}
          >
            {savingAlias ? 'Guardando...' : 'Guardar alias'}
          </button>
        </form>
      </div>

      <div className="profile-card">
        <div className="profile-section-heading">
          <h2>Cambiar contraseña</h2>
          <p>
            Establece una nueva contraseña para acceder
            a tu cuenta.
          </p>
        </div>

        <form onSubmit={handleChangePassword}>
          <div className="profile-field">
            <label htmlFor="new-password">
              Nueva contraseña
            </label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              autoComplete="new-password"
              required
            />
          </div>

          <div className="profile-field">
            <label htmlFor="confirm-password">
              Confirmar nueva contraseña
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="profile-button"
            disabled={savingPassword}
          >
            {savingPassword
              ? 'Actualizando...'
              : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Profile
