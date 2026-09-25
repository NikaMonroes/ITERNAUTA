import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'
import './Catalog.css'

interface Offer {
  partner: string
  partnerSku: string
  price: number
  stock: number
  status: string
}

interface Publication {
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

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price)
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

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await apiGet<Category[]>(
          '/catalog/categories',
        )

        setCategories(response)
      } catch (err) {
        console.error(
          'Error cargando categorías:',
          err,
        )
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
  }, [
    search,
    category,
    publisher,
    page,
  ])

  const publishers = Array.from(
    new Set(
      publications
        .map(
          (publication) =>
            publication.publisher,
        )
        .filter(
          (
            publisher,
          ): publisher is string =>
            Boolean(publisher),
        ),
    ),
  )

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
    <main className="catalog-page">
      <section className="catalog-hero">
        <span className="catalog-kicker">
          ✦ BIBLIOTECA ITERNAUTA
        </span>

        <h1>Explora el catálogo</h1>

        <p>
          Encuentra mangas, cómics entre miles de historias.
        </p>
      </section>

      <section className="catalog-filters">
        <div className="catalog-search">
          <label htmlFor="catalog-search">
            Buscar
          </label>

          <div className="search-field">
            <span>🔍</span>

            <input
              id="catalog-search"
              type="text"
              placeholder="Buscar por título..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="catalog-category">
            Categoría
          </label>

          <select
            id="catalog-category"
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

        <div>
          <label htmlFor="catalog-publisher">
            Editorial
          </label>

          <select
            id="catalog-publisher"
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
      </section>

      <div className="catalog-summary">
        <span>
          {pagination.total.toLocaleString('es-CO')}{' '}
          publicaciones
        </span>

        {!loading &&
          pagination.totalPages > 0 && (
            <span>
              Página {pagination.page} de{' '}
              {pagination.totalPages}
            </span>
          )}
      </div>

      {loading && (
        <div className="catalog-state">
          <span className="catalog-loader">
            ✦
          </span>

          <p>
            Explorando la biblioteca...
          </p>
        </div>
      )}

      {error && (
        <div className="catalog-error">
          <strong>
            No pudimos cargar el catálogo.
          </strong>

          <span>{error}</span>
        </div>
      )}

      {!loading &&
        !error &&
        publications.length === 0 && (
          <div className="catalog-state">
            <span>🌌</span>

            <h2>
              No encontramos publicaciones
            </h2>

            <p>
              Prueba con otra búsqueda o cambia
              los filtros.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        publications.length > 0 && (
          <>
            <section className="catalog-grid">
              {publications.map(
                (publication) => {
                  const availableOffers =
                    publication.offers.filter(
                      (offer) =>
                        offer.status ===
                          'available' &&
                        offer.stock > 0,
                    )

                  return (
                    <article
                      className="publication-card"
                      key={publication.id}
                    >
                      <a
                        href={`/catalog/publications/${publication.id}`}
                        className="catalog-publication-cover"
                      >
                        {publication.coverUrl ? (
                          <img
                            src={
                              publication.coverUrl
                            }
                            alt={
                              publication.title
                            }
                          />
                        ) : (
                          <div className="cover-placeholder">
                            <span>✦</span>
                            <small>
                              Sin portada
                            </small>
                          </div>
                        )}
                      </a>

                      <div className="publication-body">
                        <a
                          href={`/catalog/publications/${publication.id}`}
                          className="publication-title"
                        >
                          {publication.title}
                        </a>

                        <div className="publication-meta">
                          {publication.volume !==
                            null && (
                            <span>
                              Vol.{' '}
                              {
                                publication.volume
                              }
                            </span>
                          )}

                          {publication.publisher && (
                            <span>
                              {
                                publication.publisher
                              }
                            </span>
                          )}
                        </div>

                        {publication.isbn && (
                          <div className="publication-isbn">
                            ISBN{' '}
                            {publication.isbn}
                          </div>
                        )}

                        <div className="publication-offers">
                          {availableOffers.length >
                          0 ? (
                            <>
                              <div className="offers-heading">
                                ⭐{' '}
                                {availableOffers.length ===
                                1
                                  ? 'Disponible con'
                                  : `${availableOffers.length} partners`}
                              </div>

                              {availableOffers.map(
                                (
                                  offer,
                                  index,
                                ) => (
                                  <div
                                    className="offer-row"
                                    key={`${offer.partner}-${index}`}
                                  >
                                    <span>
                                      ⭐{' '}
                                      {
                                        offer.partner
                                      }
                                    </span>

                                    <strong>
                                      {formatPrice(
                                        offer.price,
                                      )}
                                    </strong>
                                  </div>
                                ),
                              )}
                            </>
                          ) : (
                            <div className="no-offers">
                              ○ Sin ofertas disponibles
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                },
              )}
            </section>

            <nav
              className="catalog-pagination"
              aria-label="Paginación del catálogo"
            >
              <button
                type="button"
                onClick={previousPage}
                disabled={page <= 1}
              >
                ← Anterior
              </button>

              <span>
                {pagination.page} /{' '}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                onClick={nextPage}
                disabled={
                  page >=
                  pagination.totalPages
                }
              >
                Siguiente →
              </button>
            </nav>
          </>
        )}
    </main>
  )
}

export default Catalog