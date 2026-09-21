import './Account.css'
import { useAuth } from './AuthContext'

function Account() {
  const {
    user,
    signOut,
  } = useAuth()

  async function cerrarSesion() {
    await signOut()

    window.location.href = '/'
  }

  return (
    <div className="account-page">
      <div className="account-container">

        <header className="account-header">
          <span className="account-kicker">
            MI CUENTA
          </span>

          <h1>Tu espacio en ITERNAUTA</h1>

          <p>
            Administra tu cuenta y descubre las opciones
            disponibles para ampliar tu experiencia.
          </p>
        </header>

        <section className="account-card account-profile">
          <div>
            <span className="account-label">
              Correo electrónico
            </span>

            <strong className="account-email">
              {user?.email}
            </strong>
          </div>

          <div className="account-plan">
            <span>Plan actual</span>
            <strong>Free</strong>
          </div>

          <button
            type="button"
            className="account-logout"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </section>

        <section className="account-options">

          <article className="account-option">
            <div className="account-option-icon">
              ✦
            </div>

            <div className="account-option-content">
              <span className="account-label">
                ITERNAUTA PREMIUM
              </span>

              <h2>
                Lleva tu biblioteca más lejos
              </h2>

              <p>
                Accede a un catálogo sin límite y,
                próximamente, a opciones de personalización
                y nuevas funciones para tu cuenta.
              </p>

              <a
                href="/premium"
                className="account-option-link"
              >
                Conocer Premium →
              </a>
            </div>
          </article>

          <article className="account-option">
            <div className="account-option-icon">
              ◈
            </div>

            <div className="account-option-content">
              <span className="account-label">
                PARTNERS
              </span>

              <h2>
                ¿Quieres ser partner?
              </h2>

              <p>
                Si tienes una tienda, editorial o proyecto
                relacionado con el mundo de las historias,
                puedes formar parte del ecosistema ITERNAUTA.
              </p>

              <a
                href="/partners"
                className="account-option-link"
              >
                Conocer opciones para partners →
              </a>
            </div>
          </article>

        </section>

      </div>
    </div>
  )
}

export default Account