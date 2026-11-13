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
    let mounted = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return

        setSesion(!!session)

        setMensaje(
          session
            ? 'Puedes establecer tu nueva contraseña.'
            : 'No hay una sesión activa. Solicita un enlace de recuperación.',
        )
      },
    )

    async function comprobarSesion() {
      const { data, error } =
        await supabase.auth.getSession()

      if (!mounted) return

      if (error) {
        setSesion(false)
        setMensaje(
          'No pudimos comprobar tu sesión.',
        )
        return
      }

      setSesion(!!data.session)

      setMensaje(
        data.session
          ? 'Puedes establecer tu nueva contraseña.'
          : 'No hay una sesión activa. Solicita un enlace de recuperación.',
      )
    }

    comprobarSesion()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function cambiarPassword(
    e: React.FormEvent,
  ) {
    e.preventDefault()
    setMensaje('')

    if (password !== confirmPassword) {
      setMensaje('Las contraseñas no coinciden.')
      return
    }

    setCargando(true)

    try {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        setSesion(false)
        setMensaje(
          'Tu sesión ha expirado. Solicita un nuevo enlace.',
        )
        return
      }

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setMensaje(`Error: ${error.message}`)
        return
      }

      setPassword('')
      setConfirmPassword('')

      setMensaje(
        '¡Contraseña actualizada correctamente!',
      )
    } catch {
      setMensaje(
        'No pudimos actualizar tu contraseña. Inténtalo nuevamente.',
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="update-password-page">
      <section className="update-password-card">

        <div className="update-password-header">
          <span className="update-password-kicker">
            ITERNAUTA
          </span>

          <h1>Nueva contraseña</h1>

          <p>
            Crea una nueva contraseña para tu
            cuenta de ITERNAUTA.
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
                autoComplete="new-password"
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
                  setConfirmPassword(e.target.value)
                }
                required
                autoComplete="new-password"
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
            <a
              href="/forgot-password"
              className="update-password-recovery-link"
            >
              Solicitar un nuevo enlace
            </a>

            <div className="update-password-register">
              <span>¿Todavía no tienes cuenta?</span>
              <a href="/register">Crear una cuenta</a>
            </div>
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
