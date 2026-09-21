import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'

interface Publication {
  id: number
  seriesId: number
  title: string
  volume: number | null
  publisher: string | null
  isbn: string | null
  coverUrl: string | null
  description: string | null
}

interface PublicationsResponse {
  data: Publication[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

function Catalog() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCatalog() {
      try {
        const response = await apiGet<PublicationsResponse>(
          '/catalog/publications',
        )

        setPublications(response.data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar el catálogo',
        )
      } finally {
        setLoading(false)
      }
    }

    loadCatalog()
  }, [])

  if (loading) {
    return <p>Cargando catálogo...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div className="container py-4">
      <h1>Catálogo ITERNAUTA</h1>

      {publications.map((publication) => (
        <article key={publication.id}>
          <h2>{publication.title}</h2>

          <p>
            Volumen: {publication.volume}
          </p>

          <p>
            Editorial: {publication.publisher}
          </p>

          <p>
            ISBN: {publication.isbn}
          </p>

          {publication.coverUrl && (
            <img
              src={publication.coverUrl}
              alt={publication.title}
              width="200"
            />
          )}

          <p>{publication.description}</p>
        </article>
      ))}
    </div>
  )
}

export default Catalog