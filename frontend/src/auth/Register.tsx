import { useState } from 'react'
import { supabase } from '../lib/supabase'

import './Register.css'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

async function registrarse(
  e: React.FormEvent,
) {
  e.preventDefault()

  setMensaje('')
  setCargando(true)

  const {
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  })

  setCargando(false)

  if (error) {
    setMensaje(`Error: ${error.message}`)
    return
  }

  setMensaje(
    'Registro realizado. Revisa tu correo para confirmar la cuenta.',
  )
}
  return (
    <main className="register-page">
      <section className="register-card">

        <div className="register-header">
          <span className="register-kicker">
            ITERNAUTA
          </span>

          <h1>
            Crear cuenta
          </h1>

          <p>
            Comienza a explorar historias,
            guarda tus publicaciones favoritas
            y construye tu propio catálogo.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={registrarse}
        >
          <div className="register-field">
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

          <div className="register-field">
            <label htmlFor="password">
              Contraseña
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

          <button
            type="submit"
            className="register-button"
            disabled={cargando}
          >
            {cargando
              ? 'Creando cuenta...'
              : 'Crear cuenta'}
          </button>
        </form>

        {mensaje && (
          <div
            className={`register-message ${
              mensaje.startsWith('Error')
                ? 'register-message-error'
                : 'register-message-success'
            }`}
          >
            {mensaje}
          </div>
        )}

        <div className="register-footer">
          <span>
            ¿Ya tienes una cuenta?
          </span>

          <a href="/login">
            Iniciar sesión
          </a>
        </div>

      </section>
    </main>
  )
}

export default Register