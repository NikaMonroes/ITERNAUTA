import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'

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
      <div className="container py-4">
        <p>Cargando publicación...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          Error: {error}
        </div>
      </div>
    )
  }

  if (!publication) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          Publicación no encontrada.
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => {
          window.location.href = '/catalog'
        }}
      >
        ← Volver al catálogo
      </button>

      <div className="row g-4">
        <div className="col-md-5 text-center">
          {publication.coverUrl && (
            <img
              src={publication.coverUrl}
              alt={publication.title}
              className="img-fluid"
              style={{
                maxHeight: '500px',
                objectFit: 'contain',
              }}
            />
          )}
        </div>

        <div className="col-md-7">
          <h1>{publication.title}</h1>

          <p>
            <strong>Volumen:</strong>{' '}
            {publication.volume ?? 'N/A'}
          </p>

          <p>
            <strong>Editorial:</strong>{' '}
            {publication.publisher ?? 'N/A'}
          </p>

          <p>
            <strong>ISBN:</strong>{' '}
            {publication.isbn ?? 'N/A'}
          </p>

          <p>
            {publication.description}
          </p>
        </div>
      </div>

      <hr className="my-5" />

      <h2>Ofertas disponibles</h2>

      {publication.offers.length === 0 ? (
        <p className="text-muted">
          No hay ofertas disponibles.
        </p>
      ) : (
        <div className="row g-3 mt-2">
          {publication.offers.map((offer, index) => (
            <div
              className="col-md-6"
              key={`${offer.partner}-${index}`}
            >
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="h5">
                    {offer.partner}
                  </h3>

                  <p className="mb-1">
                    <strong>Precio:</strong>{' '}
                    ${offer.price.toLocaleString('es-CO')}
                  </p>

                  <p className="mb-1">
                    <strong>Stock:</strong>{' '}
                    {offer.stock}
                  </p>

                  <p className="mb-1">
                    <strong>Estado:</strong>{' '}
                    {offer.status}
                  </p>

                  <p className="text-muted mb-0">
                    SKU: {offer.partnerSku}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PublicationDetail