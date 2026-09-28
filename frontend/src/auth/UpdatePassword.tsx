import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './UpdatePassword.css'

function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [mensaje, setMensaje] = useState(
    'Comprobando sesión...',
  )

  const [sesion, setSesion] = useState(false)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    async function comprobarSesion() {
      const {
        data,
        error,
      } = await supabase.auth.getSession()

      if (error) {
        setMensaje(
          'No pudimos comprobar la sesión de recuperación.',
        )
        return
      }

      if (data.session) {
        setSesion(true)
        setMensaje(
          'Sesión de recuperación detectada.',
        )
      } else {
        setMensaje(
          'No hay una sesión de recuperación activa.',
        )
      }
    }

    comprobarSesion()

    const {
      data: {
        subscription,
      },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === 'PASSWORD_RECOVERY' &&
          session
        ) {
          setSesion(true)
          setMensaje(
            'Sesión de recuperación detectada.',
          )
        }
      },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function cambiarPassword(
    e: React.FormEvent,
  ) {
    e.preventDefault()

    setMensaje('')

    if (password !== confirmPassword) {
      setMensaje(
        'Las contraseñas no coinciden.',
      )
      return
    }

    setCargando(true)

    const { error } =
      await supabase.auth.updateUser({
        password,
      })

    setCargando(false)

    if (error) {
      setMensaje(
        `Error: ${error.message}`,
      )
      return
    }

    setMensaje(
      'Contraseña actualizada correctamente.',
    )

    setPassword('')
    setConfirmPassword('')
  }

  return (
    <main className="update-password-page">
      <section className="update-password-card">

        <div className="update-password-header">
          <span className="update-password-kicker">
            ITERNAUTA
          </span>

          <h1>
            Nueva contraseña
          </h1>

          <p>
            Crea una nueva contraseña para
            recuperar el acceso a tu cuenta.
          </p>
        </div>

        <div
          className={`update-password-status ${
            sesion
              ? 'update-password-status-success'
              : 'update-password-status-info'
          }`}
        >
          {mensaje}
        </div>

        {sesion && (
          <form
            className="update-password-form"
            onSubmit={cambiarPassword}
          >
            <div className="update-password-field">
              <label htmlFor="password">
                Nueva contraseña
              </label>

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <div className="update-password-field">
              <label htmlFor="confirmPassword">
                Confirmar contraseña
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value,
                  )
                }
                required
              />
            </div>

            <button
              type="submit"
              className="update-password-button"
              disabled={cargando}
            >
              {cargando
                ? 'Actualizando...'
                : 'Cambiar contraseña'}
            </button>
          </form>
        )}

        {!sesion && (
          <div className="update-password-footer">
            <a href="/forgot-password">
              Solicitar un nuevo enlace
            </a>
          </div>
        )}

        {sesion && (
          <div className="update-password-footer">
            <a href="/login">
              Volver a iniciar sesión
            </a>
          </div>
        )}

      </section>
    </main>
  )
}

export default UpdatePassword