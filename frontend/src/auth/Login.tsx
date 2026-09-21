import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function iniciarSesion(e: React.FormEvent) {
    e.preventDefault()

    setMensaje('')
    setCargando(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setCargando(false)

    if (error) {
      setMensaje(`Error: ${error.message}`)
      return
    }

    console.log('Usuario autenticado:', data.user)
    console.log('Sesión:', data.session)

    setMensaje('Inicio de sesión exitoso.')
  }


  // Logout
  async function cerrarSesion() {
  setMensaje('')
  setCargando(true)

  const { error } = await supabase.auth.signOut()

  setCargando(false)

  if (error) {
    setMensaje(`Error: ${error.message}`)
    return
  }

  setMensaje('Sesión cerrada correctamente.')
}

  return (
    <div>
      <h1>ITERNAUTA</h1>
      <h2>Iniciar sesión</h2>

      <form onSubmit={iniciarSesion}>
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
          {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <br />

      <button
        type="button"
        onClick={() => {
          window.location.href = '/forgot-password'
        }}
      >
        Olvidé mi contraseña
      </button>

      <br />
      <br />

      <button
        type="button"
        onClick={() => {
          window.location.href = '/register'
        }}
      >
        Crear una cuenta
      </button>

      <p>{mensaje}</p>

      <button
        type="button"
        onClick={cerrarSesion}
        disabled={cargando}
        >
        Cerrar sesión
      </button>
    </div>
  )
}

export default Login