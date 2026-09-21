import type { JumpsellerProduct } from '../jumpseller/jumpseller.types.js';

export type IternautaCategory = 'Manga' | 'Cómic';

export type PublicationType = 'SERIE' | 'TOMO_UNICO';

export interface NormalizedSpookyProduct {
  publication: {
    title: string;
    seriesTitle: string;
    category: IternautaCategory;
    publicationType: PublicationType;
    volume: number | null;
    publisher: string | null;
    isbn: string | null;
    coverUrl: string | null;
    description: string | null;
  };

  offer: {
    partnerSku: string | null;
    price: number;
    stock: number;
    status: string;
  };

  source: {
    productId: number;
    categories: string[];
  };
}

export class SpookyAdapter {
  /**
   * Elimina únicamente el prefijo PREVENTA del título.
   *
   * Ejemplo:
   * PREVENTA Naruto 15
   * → Naruto 15
   */
  private normalizeTitle(title: string): string {
  return title
    .replace(/^PREVENTA\s*[-_]\s*/i, '')
    .replace(/^PREVENTA\s+/i, '')
    .trim()
}

  /**
   * Extrae el nombre de la serie y el volumen desde el título.
   */
  private extractSeriesData(title: string): {
    seriesTitle: string;
    volume: number | null;
    publicationType: PublicationType;
  } {
    const match = title.match(/^(.*?)\s+Vol\.?\s+(\d+)/i);

    if (!match) {
      return {
        seriesTitle: title.trim(),
        volume: null,
        publicationType: 'TOMO_UNICO',
      };
    }

    return {
      seriesTitle: match[1].trim(),
      volume: Number(match[2]),
      publicationType: 'SERIE',
    };
  }

  /**
   * Método de prueba para verificar la extracción de serie y volumen.
   */
  public testExtractSeries(title: string) {
    return this.extractSeriesData(title);
  }

  normalize(product: JumpsellerProduct): NormalizedSpookyProduct {
    /**
     * Primero normalizamos el título.
     *
     * La categorización NO cambia.
     */
    const normalizedTitle = this.normalizeTitle(product.name);

    const seriesData =
      this.extractSeriesData(normalizedTitle);

    const category = product.categories.find((category) =>
      ['Manga', 'Cómic'].includes(category.name),
    );

    if (!category) {
      throw new Error(
        `El producto "${product.name}" no pertenece a Manga ni Cómic.`,
      );
    }

    return {
      publication: {
        title: normalizedTitle,
        seriesTitle: seriesData.seriesTitle,
        category: category.name as IternautaCategory,
        publicationType: seriesData.publicationType,
        volume: seriesData.volume,

        publisher: product.brand,

        // Regla de dominio ITERNAUTA:
        // SKU de Spooky House = ISBN de ITERNAUTA.
        isbn: product.sku,

        coverUrl: product.images[0]?.url ?? null,
        description: product.description,
      },

      offer: {
        partnerSku: product.sku,
        price: product.price,
        stock: product.stock,
        status: product.status,
      },

      source: {
        productId: product.id,
        categories: product.categories.map(
          (category) => category.name,
        ),
      },
    };
  }
}