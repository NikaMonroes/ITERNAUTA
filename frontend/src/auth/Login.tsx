import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mostrarRegistro, setMostrarRegistro] =
    useState(false)
  const [cargando, setCargando] = useState(false)

  async function iniciarSesion(
    e: React.FormEvent,
  ) {
    e.preventDefault()

    setMensaje('')
    setMostrarRegistro(false)
    setCargando(true)

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (error) {
        setMensaje(
          'No pudimos iniciar sesión. Verifica tu correo y contraseña.',
        )
        setMostrarRegistro(true)
        return
      }

      window.location.href = '/catalog'
    } catch {
      setMensaje(
        'Ocurrió un problema al intentar iniciar sesión.',
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="login-page">
      <div className="login-card">

        <div className="login-header">
          <div className="login-orbit">
            ✦
          </div>

          <h1>ITERNAUTA</h1>

          <p>
            Explora historias.
            <br />
            Encuentra tu mundo.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={iniciarSesion}
        >
          <div className="login-field">
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

          <div className="login-field">
            <div className="login-label-row">
              <label htmlFor="password">
                Contraseña
              </label>

              <a href="/forgot-password">
                ¿La olvidaste?
              </a>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={cargando}
          >
            {cargando
              ? 'Ingresando...'
              : 'Ingresar'}
          </button>
        </form>

        {mensaje && (
          <div className="login-message">
            <p>{mensaje}</p>

            {mostrarRegistro && (
              <a href="/register">
                Crear una cuenta
              </a>
            )}
          </div>
        )}

        {!mostrarRegistro && (
          <div className="login-register">
            <span>
              ¿Todavía no tienes cuenta?
            </span>

            <a href="/register">
              Crear una cuenta
            </a>
          </div>
        )}

      </div>
    </section>
  )
}

export default Login
