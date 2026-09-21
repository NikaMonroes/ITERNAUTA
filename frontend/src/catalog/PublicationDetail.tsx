import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'
import './PublicationDetail.css'

interface Offer {
  partner: string
  partnerSku: string
  price: number
  stock: number
  status: string
}

interface PublicationDetail {
  id: number
  seriesId: number
  title: string
  volume: number | null
  publisher: string | null
  isbn: string | null
  coverUrl: string | null
  description: string | null
  offers: Offer[]
}

interface PublicationDetailProps {
  publicationId: number
}

function PublicationDetail({
  publicationId,
}: PublicationDetailProps) {
  const [publication, setPublication] =
    useState<PublicationDetail | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPublication() {
      try {
        const response =
          await apiGet<PublicationDetail>(
            `/catalog/publications/${publicationId}`,
          )

        setPublication(response)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar la publicación',
        )
      } finally {
        setLoading(false)
      }
    }

    loadPublication()
  }, [publicationId])

  if (loading) {
    return (
      <main className="publication-detail">
        <div className="publication-detail-container">
          <p className="publication-state">
            🚀 Cargando publicación...
          </p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="publication-detail">
        <div className="publication-detail-container">
          <div className="publication-alert publication-alert-error">
            Error: {error}
          </div>
        </div>
      </main>
    )
  }

  if (!publication) {
    return (
      <main className="publication-detail">
        <div className="publication-detail-container">
          <div className="publication-alert publication-alert-warning">
            Publicación no encontrada.
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="publication-detail">
      <div className="publication-detail-container">

        <button
          type="button"
          className="back-button"
          onClick={() => {
            window.location.href = '/catalog'
          }}
        >
          ← Volver al catálogo
        </button>

        <section className="publication-hero">

          <div className="publication-cover">
            {publication.coverUrl ? (
              <img
                src={publication.coverUrl}
                alt={publication.title}
              />
            ) : (
              <div className="publication-cover-empty">
                📚
                <span>Sin portada</span>
              </div>
            )}
          </div>

          <div className="publication-info">

            <span className="publication-label">
              PUBLICACIÓN
            </span>

            <h1>{publication.title}</h1>

            <div className="publication-meta">
              <div>
                <span>📖 Volumen</span>
                <strong>
                  {publication.volume ?? 'N/A'}
                </strong>
              </div>

              <div>
                <span>🏷️ Editorial</span>
                <strong>
                  {publication.publisher ?? 'N/A'}
                </strong>
              </div>

              <div>
                <span>🔖 ISBN</span>
                <strong>
                  {publication.isbn ?? 'N/A'}
                </strong>
              </div>
            </div>

            {publication.description && (
              <div className="publication-description">
                <h2>Descripción</h2>

                <div
                  dangerouslySetInnerHTML={{
                    __html: publication.description,
                  }}
                />
              </div>
            )}

          </div>
        </section>

        <section className="offers-section">

          <div className="section-heading">
            <div>
              <span className="publication-label">
                DISPONIBILIDAD
              </span>

              <h2>Ofertas disponibles</h2>
            </div>

            <span className="offer-count">
              {publication.offers.length}{' '}
              {publication.offers.length === 1
                ? 'oferta'
                : 'ofertas'}
            </span>
          </div>

          {publication.offers.length === 0 ? (
            <div className="no-offers">
              <span>🌌</span>
              <p>
                Actualmente no hay ofertas para esta
                publicación.
              </p>
            </div>
          ) : (
            <div className="offers-grid">

              {publication.offers.map(
                (offer, index) => {

                  const available =
                    offer.status === 'available' &&
                    offer.stock > 0

                  return (
                    <article
                      className="offer-card"
                      key={`${offer.partner}-${index}`}
                    >

                      <div className="offer-header">
                        <div className="partner-icon">
                          🏪
                        </div>

                        <div>
                          <span>
                            Partner
                          </span>

                          <h3>
                            {offer.partner}
                          </h3>
                        </div>
                      </div>

                      <div className="offer-price">
                        $
                        {offer.price.toLocaleString(
                          'es-CO',
                        )}
                      </div>

                      <div className="offer-data">

                        <div>
                          <span>📦 Stock</span>
                          <strong>
                            {offer.stock}
                          </strong>
                        </div>

                        <div>
                          <span>Estado</span>

                          <strong
                            className={
                              available
                                ? 'status-available'
                                : 'status-unavailable'
                            }
                          >
                            {available
                              ? 'Disponible'
                              : 'No disponible'}
                          </strong>
                        </div>

                      </div>

                      {offer.partnerSku && (
                        <div className="offer-sku">
                          SKU: {offer.partnerSku}
                        </div>
                      )}

                    </article>
                  )
                },
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  )
}

export default PublicationDetail