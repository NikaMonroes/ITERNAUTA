import Login from './auth/Login'
import Register from './auth/Register'
import ForgotPassword from './auth/ForgotPassword'
import UpdatePassword from './auth/UpdatePassword'

function App() {
  const path = window.location.pathname

  if (path === '/register') {
    return <Register />
  }

  if (path === '/forgot-password') {
    return <ForgotPassword />
  }

  if (path === '/update-password') {
    return <UpdatePassword />
  }

  return <Login />
}

export default App
/**
 * import { useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  useEffect(() => {
    async function comprobarConexion() {
      const { data, error } = await supabase.auth.getSession()

      console.log('SUPABASE ITERNAUTA - SESIÓN:', data.session)
      console.log('SUPABASE ITERNAUTA - ERROR:', error)
    }

    comprobarConexion()
  }, [])

  return (
    <div>
      <h1>ITERNAUTA</h1>
      <p>Conexión con Supabase inicializada.</p>
    </div>
  )
}

export default App
*/