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

// Normalizar titulo serie

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
// Test method to extract series data from a title
public testExtractSeries(title: string) {
  return this.extractSeriesData(title);
}

normalize(product: JumpsellerProduct): NormalizedSpookyProduct {
  const seriesData = this.extractSeriesData(product.name);

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
      title: product.name,
      seriesTitle: seriesData.seriesTitle,
      category: category.name as IternautaCategory,
      publicationType: seriesData.publicationType,
      volume: seriesData.volume,
      publisher: product.brand,
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
      categories: product.categories.map((category) => category.name),
    },
  };
}
/**
  normalize(product: JumpsellerProduct): NormalizedSpookyProduct {
    throw new Error('Not implemented');
  } */
}

