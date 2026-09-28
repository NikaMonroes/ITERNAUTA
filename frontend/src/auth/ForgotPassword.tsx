import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './ForgotPassword.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function recuperarPassword(
    e: React.FormEvent,
  ) {
    e.preventDefault()

    setMensaje('')
    setCargando(true)

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            'http://localhost:5173/update-password',
        },
      )

    setCargando(false)

    if (error) {
      setMensaje(
        `Error: ${error.message}`,
      )
      return
    }

    setMensaje(
      'Revisa tu correo. Te hemos enviado un enlace para restablecer tu contraseña.',
    )
  }

  return (
    <main className="forgot-page">
      <section className="forgot-card">

        <div className="forgot-header">
          <span className="forgot-kicker">
            ITERNAUTA
          </span>

          <h1>
            Recuperar contraseña
          </h1>

          <p>
            Introduce tu correo electrónico y te
            enviaremos un enlace para recuperar
            el acceso a tu cuenta.
          </p>
        </div>

        <form
          className="forgot-form"
          onSubmit={recuperarPassword}
        >
          <div className="forgot-field">
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="forgot-button"
            disabled={cargando}
          >
            {cargando
              ? 'Enviando...'
              : 'Enviar enlace de recuperación'}
          </button>
        </form>

        {mensaje && (
          <div
            className={`forgot-message ${
              mensaje.startsWith('Error')
                ? 'forgot-message-error'
                : 'forgot-message-success'
            }`}
          >
            {mensaje}
          </div>
        )}

        <div className="forgot-footer">
          <a href="/login">
            Volver a iniciar sesión
          </a>
        </div>

      </section>
    </main>
  )
}

export default ForgotPassword