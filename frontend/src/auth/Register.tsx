import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function registrarse(e: React.FormEvent) {
    e.preventDefault()

    setMensaje('')
    setCargando(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setCargando(false)

    if (error) {
      setMensaje(`Error: ${error.message}`)
      return
    }

    console.log('Usuario registrado:', data.user)
    console.log('Sesión:', data.session)

    setMensaje(
      'Registro realizado. Revisa tu correo para confirmar la cuenta.',
    )
  }

  return (
    <div>
      <h1>ITERNAUTA</h1>
      <h2>Crear cuenta</h2>

      <form onSubmit={registrarse}>
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

        <div>
          <label htmlFor="password">Contraseña</label>
          <br />
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit" disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p>{mensaje}</p>
    </div>
  )
}

export default Register