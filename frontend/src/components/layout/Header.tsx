import './Header.css'

interface HeaderProps {
  isAuthenticated?: boolean
}

function Header({
  isAuthenticated = false,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="/catalog" className="brand">
          ITERNAUTA
        </a>

        <nav className="main-nav">
          {isAuthenticated && (
            <a href="/my-catalog">
              Mi Catálogo
            </a>
          )}

          <a href="/catalog">
            Catálogo
          </a>

          <a href="/categories">
            Categorías
          </a>

          <a href="/series">
            Series
          </a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="search-button"
            aria-label="Buscar"
          >
            🔍
          </button>

          {isAuthenticated ? (
            <a
              href="/account"
              className="account-link"
            >
              👤 Mi cuenta
            </a>
          ) : (
            <a
              href="/"
              className="login-link"
            >
              Ingresar
            </a>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header