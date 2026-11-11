import { useEffect, useState } from 'react'

import Login from './auth/Login'
import Register from './auth/Register'
import ForgotPassword from './auth/ForgotPassword'
import UpdatePassword from './auth/UpdatePassword'
import Account from './auth/Account'

import Catalog from './catalog/Catalog'
import PublicationDetail from './catalog/PublicationDetail'
import MyCatalog from './my-catalog/MyCatalog'
import About from './about/About'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import {
  AuthProvider,
  useAuth,
} from './auth/AuthContext'

function AppContent() {
  const [path, setPath] = useState(window.location.pathname)

  const { user, loading } = useAuth()

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const isPrivateRoute =
      path === '/account' || path === '/my-catalog'

    if (!loading && !user && isPrivateRoute) {
      window.history.replaceState(null, '', '/login')
      setPath('/login')
    }
  }, [loading, user, path])

  if (loading) {
    return null
  }

  const isAuthenticated = Boolean(user)

  let content

  if (path === '/login') {
    content = <Login />
  } else if (path === '/register') {
    content = <Register />
  } else if (path === '/forgot-password') {
    content = <ForgotPassword />
  } else if (path === '/update-password') {
    content = <UpdatePassword />
  } else if (path === '/account') {
    content = user ? <Account /> : <Login />
  } else if (path === '/my-catalog') {
    content = user ? <MyCatalog /> : <Login />
  } else if (path === '/about') {
    content = <About />
  } else if (path.startsWith('/catalog/publications/')) {
    const publicationId = Number(path.split('/').pop())
    content = <PublicationDetail publicationId={publicationId} />
  } else if (path === '/' || path === '/catalog') {
    content = <Catalog />
  } else {
    content = <Catalog />
  }

  return (
    <div className="app-shell">
      <Header isAuthenticated={isAuthenticated} />
      <main className="app-main">{content}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
