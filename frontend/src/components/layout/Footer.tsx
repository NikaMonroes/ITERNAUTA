import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <h2>ITERNAUTA</h2>

          <p>
            Explora historias. Encuentra tu mundo.
          </p>
        </div>

        <div className="footer-column">
          <h3>Navegación</h3>

          <a href="/catalog">
            Catálogo
          </a>

          <a href="/about">
            Acerca de
          </a>
          
          <a href="/my-catalog">
            Mi Catálogo
          </a>
        </div>

        <div className="footer-column">
          <h3>Contacto</h3>

          <a href="mailto:iternauta.project@gmail.com">
            iternauta.project@gmail.com
          </a>
        </div>

        <div className="footer-partner">
          <h3>Partners</h3>

          <p>
            ITERNAUTA nace con el apoyo de{' '}
            <a
              href="https://spookyhouse.com.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>Spooky House</strong>
            </a>
            , partner inicial de este proyecto.
          </p>

          <p>
            ¿Tú también quieres ser partner
            de este proyecto?
            {' '}
            <a href="mailto:iternauta.project@gmail.com">
              Contáctanos.
            </a>
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          Desarrollado por{' '}
          <a
            href="https://wa.me/573026838855"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>MR Freelance</strong>
          </a>
          {' · '}
          2026 para <strong>ITERNAUTA Project</strong>
        </p>

        <p>
          © 2026 ITERNAUTA Project · Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer