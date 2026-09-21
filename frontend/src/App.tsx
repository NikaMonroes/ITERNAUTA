import Login from './auth/Login'
import Register from './auth/Register'
import ForgotPassword from './auth/ForgotPassword'
import UpdatePassword from './auth/UpdatePassword'

import Catalog from './catalog/Catalog'
import PublicationDetail from './catalog/PublicationDetail'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

function App() {
  const path = window.location.pathname

  const isAuthenticated = false

  let content

  if (path === '/register') {
    content = <Register />
  } else if (path === '/forgot-password') {
    content = <ForgotPassword />
  } else if (path === '/update-password') {
    content = <UpdatePassword />
  } else if (path.startsWith('/catalog/publications/')) {
    const publicationId = Number(
      path.split('/').pop(),
    )

    content = (
      <PublicationDetail
        publicationId={publicationId}
      />
    )
  } else if (path === '/catalog') {
    content = <Catalog />
  } else {
    content = <Login />
  }

  return (
    <div className="app-shell">
      <Header isAuthenticated={isAuthenticated} />

      <main className="app-main">
        {content}
      </main>

      <Footer />
    </div>
  )
}

export default App