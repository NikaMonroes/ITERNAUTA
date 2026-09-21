import { useState } from 'react'
import { supabase } from '../lib/supabase'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function recuperarPassword(e: React.FormEvent) {
    e.preventDefault()

    setMensaje('')
    setCargando(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/update-password',
    })

    setCargando(false)

    if (error) {
      setMensaje(`Error: ${error.message}`)
      return
    }

    setMensaje(
      'Revisa tu correo. Te hemos enviado un enlace para restablecer tu contraseña.',
    )
  }

  return (
    <div>
      <h1>ITERNAUTA</h1>
      <h2>Recuperar contraseña</h2>

      <form onSubmit={recuperarPassword}>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <br />
          <input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit" disabled={cargando}>
          {cargando
            ? 'Enviando...'
            : 'Enviar enlace de recuperación'}
        </button>
      </form>

      <p>{mensaje}</p>
    </div>
  )
}

export default ForgotPassword