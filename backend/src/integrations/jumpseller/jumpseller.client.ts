import { Injectable } from '@nestjs/common';

import type {
  JumpsellerProduct,
  JumpsellerProductResponse,
} from './jumpseller.types.js';

@Injectable()
export class JumpsellerClient {
  private readonly baseUrl =
    'https://api.jumpseller.com/v1';

  private readonly loginKey: string;
  private readonly authToken: string;

  constructor() {
    this.loginKey =
      process.env.JUMPSELLER_LOGIN_KEY ?? '';

    this.authToken =
      process.env.JUMPSELLER_AUTH_TOKEN ?? '';
  }

  private ensureCredentials(): void {
    if (!this.loginKey || !this.authToken) {
      throw new Error(
        'Faltan JUMPSELLER_LOGIN_KEY o JUMPSELLER_AUTH_TOKEN en las variables de entorno.',
      );
    }
  }

  async getProductsPage(
    page: number,
  ): Promise<JumpsellerProduct[]> {
    this.ensureCredentials();

    const params = new URLSearchParams({
      login: this.loginKey,
      authtoken: this.authToken,
      page: String(page),
    });

    const response = await fetch(
      `${this.baseUrl}/products.json?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(
        `Jumpseller API respondió con HTTP ${response.status}`,
      );
    }

    const data: JumpsellerProductResponse[] =
      await response.json();

    return data.map(
      (item) => item.product,
    );
  }

  /**
   * Obtiene una cantidad limitada de productos.
   *
   * Se utiliza para pruebas de sincronización
   * sin descargar todo el catálogo.
   */
  async getProducts(
    limit: number,
  ): Promise<JumpsellerProduct[]> {
    this.ensureCredentials();

    if (limit <= 0) {
      return [];
    }

    const products: JumpsellerProduct[] = [];

    const maxPages = 100;

    for (
      let page = 1;
      page <= maxPages;
      page++
    ) {
      const pageProducts =
        await this.getProductsPage(page);

      if (pageProducts.length === 0) {
        break;
      }

      products.push(
        ...pageProducts.slice(
          0,
          limit - products.length,
        ),
      );

      if (products.length >= limit) {
        break;
      }
    }

    return products;
  }

  /**
   * Obtiene todo el catálogo disponible.
   *
   * Se conserva para la sincronización completa
   * de Spooky House.
   */
  async getAllProducts(): Promise<
    JumpsellerProduct[]
  > {
    this.ensureCredentials();

    const allProducts: JumpsellerProduct[] = [];

    const maxPages = 100;

    for (
      let page = 1;
      page <= maxPages;
      page++
    ) {
      const products =
        await this.getProductsPage(page);

      if (products.length === 0) {
        break;
      }

      allProducts.push(...products);
    }

    return allProducts;
  }

  async searchProductBySKU(
    sku: string,
  ): Promise<JumpsellerProduct | null> {
    this.ensureCredentials();

    const params = new URLSearchParams({
      login: this.loginKey,
      authtoken: this.authToken,
      query: sku,
    });

    const response = await fetch(
      `${this.baseUrl}/products/search.json?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(
        `Jumpseller API respondió con HTTP ${response.status}`,
      );
    }

    const data: JumpsellerProductResponse[] =
      await response.json();

    if (data.length === 0) {
      return null;
    }

    return data[0].product;
  }
}