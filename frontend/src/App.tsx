import Login from './auth/Login'
import Register from './auth/Register'
import ForgotPassword from './auth/ForgotPassword'
import UpdatePassword from './auth/UpdatePassword'
import Account from './auth/Account'

import Catalog from './catalog/Catalog'
import PublicationDetail from './catalog/PublicationDetail'
import MyCatalog from './my-catalog/MyCatalog'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import {
  AuthProvider,
  useAuth,
} from './auth/AuthContext'

// Imports del catálogo



function AppContent() {
  const path = window.location.pathname

  const {
    user,
    loading,
  } = useAuth()

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
  content = <Account />

  } else if (path === '/my-catalog') {
  content = <MyCatalog />

  } else if (
    path.startsWith('/catalog/publications/')
  ) {
    const publicationId = Number(
      path.split('/').pop(),
    )

    content = (
      <PublicationDetail
        publicationId={publicationId}
      />
    )

  } else if (
    path === '/' ||
    path === '/catalog'
  ) {
    content = <Catalog />

  } else {
    content = <Catalog />
  }

  return (
    <div className="app-shell">
      <Header
        isAuthenticated={isAuthenticated}
      />

      <main className="app-main">
        {content}
      </main>

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