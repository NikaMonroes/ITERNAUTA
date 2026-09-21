import Login from './auth/Login'
import Register from './auth/Register'
import ForgotPassword from './auth/ForgotPassword'
import UpdatePassword from './auth/UpdatePassword'
import Catalog from './catalog/Catalog'
import PublicationDetail from './catalog/PublicationDetail'


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
  if (path.startsWith('/catalog/publications/')) {
  const publicationId = Number(
    path.split('/').pop(),
  )

  return (
    <PublicationDetail
      publicationId={publicationId}
    />
  )
}

  if (path === '/catalog') {
    return <Catalog />
  }

  return <Login />
}

export default App