import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mensaje, setMensaje] = useState('Comprobando sesión...')
  const [sesion, setSesion] = useState(false)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    async function comprobarSesion() {
      const { data, error } = await supabase.auth.getSession()

      console.log('UPDATE PASSWORD - SESIÓN:', data.session)
      console.log('UPDATE PASSWORD - ERROR:', error)

      if (data.session) {
        setSesion(true)
        setMensaje('Sesión de recuperación detectada.')
      } else {
        setMensaje('No hay una sesión de recuperación activa.')
      }
    }

    comprobarSesion()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('UPDATE PASSWORD - EVENTO:', event)
      console.log('UPDATE PASSWORD - SESIÓN:', session)

      if (event === 'PASSWORD_RECOVERY') {
        setSesion(true)
        setMensaje('Sesión de recuperación detectada.')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function cambiarPassword(e: React.FormEvent) {
    e.preventDefault()

    setMensaje('')

    if (password !== confirmPassword) {
      setMensaje('Las contraseñas no coinciden.')
      return
    }

    setCargando(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    setCargando(false)

    if (error) {
      setMensaje(`Error: ${error.message}`)
      return
    }

    setMensaje('Contraseña actualizada correctamente.')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div>
      <h1>ITERNAUTA</h1>
      <h2>Cambiar contraseña</h2>

      <p>{mensaje}</p>

      {sesion && (
        <form onSubmit={cambiarPassword}>
          <div>
            <label htmlFor="password">Nueva contraseña</label>
            <br />
            <input
              id="password"
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <br />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <br />

          <button type="submit" disabled={cargando}>
            {cargando
              ? 'Actualizando...'
              : 'Cambiar contraseña'}
          </button>
        </form>
      )}
    </div>
  )
}

export default UpdatePassword