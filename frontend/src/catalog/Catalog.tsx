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

interface Category {
  id: number
  name: string
}

function Catalog() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [publisher, setPublisher] = useState('')

  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const publishers = Array.from(
    new Set(
      publications
        .map((publication) => publication.publisher)
        .filter(
          (publisher): publisher is string =>
            Boolean(publisher),
        ),
    ),
  )

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await apiGet<Category[]>(
          '/catalog/categories',
        )

        setCategories(response)
      } catch (err) {
        console.error('Error cargando categorías:', err)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (search.trim()) {
          params.set('search', search.trim())
        }

        if (category) {
          params.set('category', category)
        }

        if (publisher) {
          params.set('publisher', publisher)
        }

        params.set('page', String(page))
        params.set('limit', '20')

        const response =
          await apiGet<PublicationsResponse>(
            `/catalog/publications?${params.toString()}`,
          )

        setPublications(response.data)
        setPagination(response.pagination)
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
  }, [search, category, publisher, page])

  function handleSearchChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setSearch(event.target.value)
    setPage(1)
  }

  function handleCategoryChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    setCategory(event.target.value)
    setPage(1)
  }

  function handlePublisherChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    setPublisher(event.target.value)
    setPage(1)
  }

  function previousPage() {
    setPage((currentPage) =>
      Math.max(currentPage - 1, 1),
    )
  }

  function nextPage() {
    setPage((currentPage) =>
      Math.min(
        currentPage + 1,
        pagination.totalPages,
      ),
    )
  }

  return (
    <div className="container py-4">
      <h1>Catálogo ITERNAUTA</h1>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label">
            Buscar
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Buscar por título..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">
            Categoría
          </label>

          <select
            className="form-select"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">
              Todas
            </option>

            {categories.map((item) => (
              <option
                key={item.id}
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">
            Editorial
          </label>

          <select
            className="form-select"
            value={publisher}
            onChange={handlePublisherChange}
          >
            <option value="">
              Todas
            </option>

            {publishers.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <p>Cargando catálogo...</p>
      )}

      {error && (
        <div className="alert alert-danger">
          Error: {error}
        </div>
      )}

      {!loading &&
        !error &&
        publications.length === 0 && (
          <div className="alert alert-info">
            No se encontraron publicaciones.
          </div>
        )}

      {!loading &&
        !error &&
        publications.length > 0 && (
          <>
            <div className="row g-4">
              {publications.map((publication) => (
                <div
                  className="col-md-6 col-lg-4"
                  key={publication.id}
                >
                  <article className="card h-100">
                    {publication.coverUrl && (
                      <img
                        src={publication.coverUrl}
                        className="card-img-top"
                        alt={publication.title}
                        style={{
                          height: '350px',
                          objectFit: 'contain',
                        }}
                      />
                    )}

                    <div className="card-body">
                      <h2 className="h5">
                        <a
                          href={`/catalog/publications/${publication.id}`}
                          className="text-decoration-none"
                        >
                          {publication.title}
                        </a>
                      </h2>

                      <p className="mb-1">
                        <strong>Volumen:</strong>{' '}
                        {publication.volume ?? 'N/A'}
                      </p>

                      <p className="mb-1">
                        <strong>Editorial:</strong>{' '}
                        {publication.publisher ?? 'N/A'}
                      </p>

                      <p className="mb-1">
                        <strong>ISBN:</strong>{' '}
                        {publication.isbn ?? 'N/A'}
                      </p>

                      <p className="text-muted">
                        {publication.description}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button
                className="btn btn-outline-primary"
                onClick={previousPage}
                disabled={page <= 1}
              >
                Anterior
              </button>

              <span>
                Página {pagination.page} de{' '}
                {pagination.totalPages}
              </span>

              <button
                className="btn btn-outline-primary"
                onClick={nextPage}
                disabled={
                  page >= pagination.totalPages
                }
              >
                Siguiente
              </button>
            </div>
          </>
        )}
    </div>
  )
}

export default Catalog