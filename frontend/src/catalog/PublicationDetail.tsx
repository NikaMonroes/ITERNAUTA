import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'
import { useAuth } from '../auth/AuthContext'
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
  categoryId: number
  category: string
}

interface PublicationDetailProps {
  publicationId: number
}

interface Collection {
  id: number
  userId: number
  name: string
  type: 'SYSTEM' | 'CUSTOM'
  createdAt: string
  updatedAt: string
}

function PublicationDetail({
  publicationId,
}: PublicationDetailProps) {
  const { user } = useAuth()

  // Estado de la publicación
  const [publication, setPublication] =
    useState<PublicationDetail | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado para agregar a colección
  const [adding, setAdding] = useState(false)
  const [addMessage, setAddMessage] =
    useState<string | null>(null)

  /**
   * Agrega la publicación a la colección
   * correspondiente según su categoría.
   */
  async function handleAddToCollection() {
    if (!user) {
      window.location.href = '/login'
      return
    }

    if (!publication) {
      return
    }

    setAdding(true)
    setAddMessage(null)

    try {
      const collections = await apiGet<Collection[]>(
        '/collections',
      )

      const collectionName =
        publication.category?.toLowerCase() === 'manga'
          ? 'manga'
          : 'cómic'

      const collection = collections.find(
        (item) =>
          item.name.toLowerCase() === collectionName,
      )

      if (!collection) {
        throw new Error(
          `No encontramos tu colección de ${collectionName}.`,
        )
      }

      await apiPost(
        `/collections/${collection.id}/items`,
        {
          publicationId: publication.id,
        },
      )

      setAddMessage(
        `✓ ${publication.title} fue añadida a tu colección.`,
      )
    } catch (err) {
      setAddMessage(
        err instanceof Error
          ? err.message
          : 'No pudimos añadir la publicación.',
      )
    } finally {
      setAdding(false)
    }
  }

  /**
   * Carga el detalle de la publicación.
   */
  useEffect(() => {
    async function loadPublication() {
      try {
        const response = await apiGet<PublicationDetail>(
          `/catalog/publications/${publicationId}`,
        )
        // console.log(response)
        console.log('PUBLICATION DETAIL:', response)

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

  /**
   * Estado de carga.
   */
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

  /**
   * Estado de error.
   */
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

  /**
   * Publicación no encontrada.
   */
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

  /**
   * Determina desde qué sección llegó el usuario.
   */
  

  return (
    <main className="publication-detail">
      <div className="publication-detail-container">

        {/* Botón volver */}
        <button
          type="button"
          className="back-button"
          onClick={() => {
            const params = new URLSearchParams(
              window.location.search,
            )

            const from = params.get('from')

            window.location.href =
              from === 'my-catalog'
                ? '/my-catalog'
                : '/catalog'
          }}
        >
          ← Volver al catálogo
        </button>

        {/* Información principal */}
        <section className="publication-main">

          {/* Portada */}
          <div className="publication-cover">
            {publication.coverUrl ? (
              <img
                src={publication.coverUrl}
                alt={`Portada de ${publication.title}`}
              />
            ) : (
              <div className="publication-cover-placeholder">
                Sin portada
              </div>
            )}
          </div>

          {/* Información */}
          <div className="publication-info">

            <span className="publication-label">
              {publication.category}
            </span>

            <h1>{publication.title}</h1>

            {publication.volume !== null && (
              <p className="publication-volume">
                Volumen {publication.volume}
              </p>
            )}

            {/* Metadatos */}
            <div className="publication-meta">

              <div>
                <span>Editorial</span>

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

            {/* Agregar a colección */}
            <div className="publication-actions">
              <button
                type="button"
                className="collection-button"
                onClick={handleAddToCollection}
                disabled={adding}
              >
                {adding
                  ? 'Añadiendo...'
                  : 'Añadir a mi colección'}
              </button>

              {addMessage && (
                <p className="collection-message">
                  {addMessage}
                </p>
              )}
            </div>

          </div>
        </section>

        {/* Descripción */}
        {publication.description && (
          <section className="publication-description">
            <h2>Descripción</h2>

            <div
              dangerouslySetInnerHTML={{
                __html: publication.description,
              }}
            />
          </section>
        )}

        {/* Ofertas */}
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

          {/* Sin ofertas */}
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

                      {/* Partner */}
                      <div className="offer-header">

                        <div className="partner-icon">
                          🪐
                        </div>

                        <div>
                          <span>Partner</span>

                          <h3>
                            {offer.partner}
                          </h3>
                        </div>

                      </div>

                      {/* Precio */}
                      <div className="offer-price">
                        $
                        {offer.price.toLocaleString(
                          'es-CO',
                        )}
                      </div>

                      {/* Datos */}
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

                      {/* SKU */}
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