import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'
import './About.css'

interface AboutCategory {
  name: string
  icon: string
  description: string
}

interface AboutData {
  name: string
  slogan: string
  description: string
  about: string
  categories: AboutCategory[]
  howItWorks: string[]
  partner: {
    name: string
    description: string
    website: string
  }
  footer: {
    name: string
    slogan: string
  }
}

function About() {
  const [about, setAbout] =
    useState<AboutData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    async function loadAbout() {
      try {
        const response =
          await apiGet<AboutData>('/about')

        setAbout(response)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No pudimos cargar la información de ITERNAUTA.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadAbout()
  }, [])

  if (loading) {
    return (
      <main className="about-page">
        <div className="about-state">
          <span>✦</span>
          <p>Cargando ITERNAUTA...</p>
        </div>
      </main>
    )
  }

  if (error || !about) {
    return (
      <main className="about-page">
        <div className="about-state about-error">
          <span>🌌</span>

          <h1>
            No pudimos cargar esta información.
          </h1>

          <p>
            {error ??
              'Intenta nuevamente en unos momentos.'}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="about-page">

      {/* HERO */}

      <section className="about-hero">

  <div className="about-hero-content">

    <span className="about-kicker">
      ACERCA DE {about.name}
    </span>

    <h1>
      Explora historias.
      <br />
      Encuentra tu mundo.
    </h1>

    <p>
      {about.description}
    </p>

    <div className="about-hero-tags">
      <span>📖 Manga</span>
      <span>💥 Cómic</span>
      <span>🌌 Historias sin fronteras</span>
    </div>

  </div>

  <div className="about-hero-image">

    <img
      src="/images/iternauta-about.png"
      alt="ITERNAUTA, biblioteca virtual de manga y cómic"
    />

  </div>

</section>


      {/* ¿QUÉ ES ITERNAUTA? */}

      <section className="about-section about-introduction">

        <span className="about-section-kicker">
          ¿QUÉ ES ITERNAUTA?
        </span>

        <h2>
          Una biblioteca para explorar historias.
        </h2>

        <p>
          {about.about}
        </p>

      </section>


      {/* CATÁLOGO */}

      <section className="about-section">

        <div className="about-section-heading">

          <span className="about-section-kicker">
            NUESTRO CATÁLOGO
          </span>

          <h2>
            Manga y cómic.
          </h2>

          <p>
            Explora publicaciones, descubre nuevas
            historias y consulta información sobre
            cada título.
          </p>

        </div>


        <div className="about-categories">

          {about.categories.map((category) => (
            <article
              key={category.name}
              className="about-category"
            >

              <span className="about-category-icon">
                {category.icon}
              </span>

              <h3>
                {category.name}
              </h3>

              <p>
                {category.description}
              </p>

            </article>
          ))}


          <article className="about-category">

            <span className="about-category-icon">
              📚
            </span>

            <h3>
              Mi Catálogo
            </h3>

            <p>
              Guarda publicaciones y construye
              tu propia biblioteca personal dentro
              de ITERNAUTA.
            </p>

          </article>


          <article className="about-category">

            <span className="about-category-icon">
              🛒
            </span>

            <h3>
              Encuentra dónde conseguirlo
            </h3>

            <p>
              Consulta las ofertas disponibles
              y descubre dónde puedes conseguir
              tus publicaciones favoritas.
            </p>

          </article>

        </div>

      </section>


      {/* MI CATÁLOGO */}

      <section className="about-section about-library">

        <div className="about-library-content">

          <span className="about-section-kicker">
            MI CATÁLOGO
          </span>

          <h2>
            Tu biblioteca personal.
          </h2>

          <p>
            Guarda los títulos que quieres leer,
            consultar o tener presentes.
          </p>

          <p>
            Cada publicación que añades pasa a
            formar parte de tu espacio personal
            dentro de ITERNAUTA.
          </p>

        </div>


        <div className="about-library-card">

          <div>
            <span>📖</span>

            <strong>
              Manga
            </strong>

            <small>
              Tus historias guardadas.
            </small>
          </div>

          <hr />

          <div>
            <span>💥</span>

            <strong>
              Cómic
            </strong>

            <small>
              Tu colección personal.
            </small>
          </div>

        </div>

      </section>


      {/* CÓMO FUNCIONA */}

      <section className="about-section about-how">

        <div className="about-section-heading">

          <span className="about-section-kicker">
            ¿CÓMO FUNCIONA?
          </span>

          <h2>
            Tu recorrido en ITERNAUTA.
          </h2>

        </div>


        <div className="about-steps">

          {about.howItWorks.map(
            (step, index) => (
              <div
                key={step}
                className="about-step"
              >

                <span className="about-step-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="about-step-name">
                  {step}
                </span>

              </div>
            ),
          )}

        </div>

      </section>


      {/* PLANES */}

      <section className="about-section">

        <div className="about-section-heading">

          <span className="about-section-kicker">
            TU BIBLIOTECA, A TU RITMO
          </span>

          <h2>
            Empieza gratis. Crece cuando quieras.
          </h2>

          <p>
            ITERNAUTA está pensado para que puedas
            comenzar a construir tu biblioteca desde
            el primer día y ampliar sus posibilidades
            cuando quieras llevarla más lejos.
          </p>

        </div>


        <div className="about-plans">

          {/* FREE */}

          <article className="about-plan-card">

            <div className="about-plan-header">

              <span className="about-plan-icon">
                📚
              </span>

              <div>

                <span className="about-plan-label">
                  PLAN
                </span>

                <h3>
                  FREE
                </h3>

              </div>

            </div>


            <div className="about-plan-limit">

              <strong>
                100
              </strong>

              <span>
                títulos
              </span>

            </div>


            <ul>

              <li>
                <span>✓</span>
                Catálogo de manga y cómic
              </li>

              <li>
                <span>✓</span>
                Búsqueda y filtros
              </li>

              <li>
                <span>✓</span>
                Información detallada de publicaciones
              </li>

              <li>
                <span>✓</span>
                Mi Catálogo
              </li>

              <li>
                <span>✓</span>
                Hasta 100 títulos guardados
              </li>

            </ul>

          </article>


          {/* PREMIUM */}

          <article className="about-plan-card about-plan-premium">

            <div className="about-plan-header">

              <span className="about-plan-icon">
                ✨
              </span>

              <div>

                <span className="about-plan-label">
                  PLAN
                </span>

                <h3>
                  PREMIUM
                </h3>

              </div>

            </div>


            <p className="about-premium-intro">
              ¿Quieres personalizar y aumentar
              tu biblioteca? Premium lleva tu
              experiencia un paso más allá.
            </p>


            <ul>

              <li>
                <span>✓</span>
                Mayor capacidad de almacenamiento
              </li>

              <li>
                <span>✓</span>
                Colecciones personalizadas
              </li>

              <li>
                <span>✓</span>
                Organización avanzada
              </li>

              <li>
                <span>✓</span>
                Beneficios exclusivos
              </li>

              <li>
                <span>✓</span>
                Nuevas funcionalidades
              </li>

            </ul>

          </article>

        </div>

      </section>


      {/* RECOMPENSAS */}

      <section className="about-section">

        <div className="about-rewards">

          <div className="about-rewards-icon">
            🎁
          </div>

          <div>

            <span className="about-section-kicker">
              RECOMPENSAS
            </span>

            <h2>
              Spookyos y beneficios.
            </h2>

            <p>
              Participa, descubre y conecta con
              nuestros partners para acceder a
              recompensas y experiencias dentro
              del ecosistema ITERNAUTA.
            </p>

          </div>

        </div>

      </section>


      {/* PARTNER */}

      <section className="about-section">

        <div className="about-partner">

          <div>

            <span className="about-section-kicker">
              🤝 NUESTRO PARTNER INICIAL
            </span>

            <h2>
              {about.partner.name}
            </h2>

            <p>
              {about.partner.description}
            </p>

          </div>

          <a
            href={about.partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="about-partner-button"
          >
            Visitar Spooky House
            <span>↗</span>
          </a>

        </div>

      </section>

            {/* PARTNER INVITATION*/}

      <section className="about-partner-contact">

        <div className="about-partner-contact-content">

                <span className="about-section-kicker">
                🤝 ¿QUIERES SER PARTNER?
                </span>

                <h2>
                Construyamos nuevas rutas para las historias.
                </h2>

                <p>
                ITERNAUTA está pensado para crecer junto a editoriales,
                tiendas, proyectos culturales y otros aliados relacionados
                con el mundo del manga y el cómic.
                </p>

                <p>
                Si quieres conocer el proyecto, explorar una alianza
                o convertirte en partner de ITERNAUTA, escríbenos.
                </p>

                <a
                href="mailto:iternauta.project@gmail.com"
                className="about-partner-contact-button"
                >
                Contactar a ITERNAUTA
                <span>↗</span>
                </a>

            </div>

        </section>


      {/* CIERRE */}

      <section className="about-closing">

        <span>
          {about.footer.name}
        </span>

        <h2>
          {about.footer.slogan}
        </h2>

      </section>

    </main>
  )
}

export default About