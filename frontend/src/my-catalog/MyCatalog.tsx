import { useEffect, useState } from 'react'
import { apiDelete, apiGet } from '../lib/api'
import './MyCatalog.css'

interface Collection {
  id: number
  userId: number
  name: string
  type: 'SYSTEM' | 'CUSTOM'
  createdAt: string
  updatedAt: string
}

interface CollectionItem {
  id: number
  collectionId: number
  publicationId: number
  title: string
  volume: number | null
  publisher: string | null
  isbn: string | null
  coverUrl: string | null
  description: string | null
  addedAt: string
}

function MyCatalog() {
  const [collections, setCollections] =
    useState<Collection[]>([])

  const [items, setItems] =
    useState<CollectionItem[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    async function loadCollections() {
      setLoading(true)
      setError(null)

      try {
        const response =
          await apiGet<Collection[]>(
            '/collections',
          )

        setCollections(response)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar tu catálogo',
        )
      } finally {
        setLoading(false)
      }
    }

    loadCollections()
  }, [])

  async function handleRemoveFromCollection(
  collectionId: number,
  publicationId: number,
) {
  try {
    await apiDelete(
      `/collections/${collectionId}/items/${publicationId}`,
    )

    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.collectionId === collectionId &&
            item.publicationId === publicationId
          ),
      ),
    )
  } catch (error) {
    console.error(
      'Error eliminando publicación de la colección:',
      error,
    )
  }
}

  return (
    <main className="my-catalog-page">

      <section className="my-catalog-hero">
        <span className="my-catalog-kicker">
          ✦ MI BIBLIOTECA
        </span>

        <h1>Mi Catálogo</h1>

        <p>
          Guarda tus historias favoritas y organiza tu
          propia colección en ITERNAUTA.
        </p>
      </section>

      {loading && (
        <div className="my-catalog-state">
          <span className="my-catalog-loader">
            ✦
          </span>

          <p>
            Preparando tu biblioteca...
          </p>
        </div>
      )}

      {error && (
        <div className="my-catalog-error">
          <strong>
            No pudimos cargar tu catálogo.
          </strong>

          <span>{error}</span>
        </div>
      )}

      {!loading &&
        !error &&
        collections.length === 0 && (
          <div className="my-catalog-state">
            <span>🌌</span>

            <h2>
              Tu biblioteca está esperando historias
            </h2>

            <p>
              Explora el catálogo y añade tu primera
              publicación.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        collections.length > 0 && (
          <section className="collections-section">

            <div className="collections-heading">
              <div>
                <span className="collections-kicker">
                  TUS COLECCIONES
                </span>

                <h2>
                  Organiza tus historias
                </h2>
              </div>

              <span className="collections-count">
                {collections.length}{' '}
                {collections.length === 1
                  ? 'colección'
                  : 'colecciones'}
              </span>
            </div>

            <div className="collections-grid">
              {collections.map((collection) => (
                <article
                  key={collection.id}
                  className="collection-card"
                >
                  <div className="collection-icon">
                    {collection.name.toLowerCase() ===
                    'manga'
                      ? '📖'
                      : '💥'}
                  </div>

                  <div className="collection-info">
                    <span className="collection-type">
                      {collection.type === 'SYSTEM'
                        ? 'COLECCIÓN BASE'
                        : 'COLECCIÓN PERSONAL'}
                    </span>

                    <h3>
                      {collection.name}
                    </h3>

                    <p>
                      Tu colección de{' '}
                      {collection.name.toLowerCase()}.
                    </p>
                  </div>

                  <button
                    className="collection-button"
                    type="button"
                    onClick={async () => {
  try {
    const response =
      await apiGet<CollectionItem[]>(
        `/collections/${collection.id}/items`,
      )

    setItems(response)

    console.log(
      'Colección cargada:',
      collection.name,
      response,
    )
  } catch (err) {
    console.error(
      'Error cargando colección:',
      err,
    )
  }
}}
                    >                
                    Ver colección
                    <span>→</span>
                   </button>
                </article>
              ))}
            </div>

            <div className="collection-publications">

                <div className="collections-heading">
  <div>
    <span className="collections-kicker">
      TU BIBLIOTECA
    </span>

    <h2>
      Tienes en tu colección
    </h2>
  </div>

  <span className="collections-count">
    {items.length}{' '}
    {items.length === 1
      ? 'publicación'
      : 'publicaciones'}
  </span>
</div>

                {items.length === 0 ? (
                    <div className="my-catalog-state">
                    <span>🌌</span>

                    <h2>
                        Esta colección está vacía
                    </h2>

                    <p>
                        Explora el catálogo y añade una publicación.
                    </p>
                    </div>
                ) : (
                    <div className="collection-publications-grid">

  {items.map((item) => (
    <article
      key={item.id}
      className="collection-publication-card"
      onClick={() => {
        window.location.href =
          `/catalog/publications/${item.publicationId}?from=my-catalog`
      }}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          window.location.href =
            `/catalog/publications/${item.publicationId}?from=my-catalog`
        }
      }}
    >

      <div className="collection-publication-cover">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
          />
        ) : (
          <div className="collection-publication-no-cover">
            📖
          </div>
        )}
      </div>

      <div className="collection-publication-info">

        <h3>
          {item.title}
        </h3>

        {item.volume !== null && (
          <span>
            Vol. {item.volume}
          </span>
        )}

        {item.publisher && (
          <span>
            {item.publisher}
          </span>
        )}

        <button
          type="button"
          className="collection-remove-button"
          onClick={(event) => {
            event.stopPropagation()

            handleRemoveFromCollection(
              item.collectionId,
              item.publicationId,
            )
          }}
        >
          Quitar de mi colección
        </button>

      </div>

    </article>
  ))}

</div>
                )}

            </div>

          </section>
        )}
    </main>
  )
}

export default MyCatalog