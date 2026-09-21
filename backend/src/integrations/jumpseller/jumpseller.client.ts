import { Injectable } from '@nestjs/common';
import type {
  JumpsellerProduct,
  JumpsellerProductResponse,
} from './jumpseller.types.js';

@Injectable()
export class JumpsellerClient {
  private readonly baseUrl = 'https://api.jumpseller.com/v1';

  private readonly loginKey: string;
  private readonly authToken: string;

  constructor() {
    const loginKey = process.env.JUMPSELLER_LOGIN_KEY;
    const authToken = process.env.JUMPSELLER_AUTH_TOKEN;

    if (!loginKey || !authToken) {
      throw new Error(
        'Faltan JUMPSELLER_LOGIN_KEY o JUMPSELLER_AUTH_TOKEN en las variables de entorno.',
      );
    }

    this.loginKey = loginKey;
    this.authToken = authToken;
  }

  async getProductsPage(page: number): Promise<JumpsellerProduct[]> {
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

    const data: JumpsellerProductResponse[] = await response.json();

    return data.map((item) => item.product);
  }

  async getAllProducts(): Promise<JumpsellerProduct[]> {
    const allProducts: JumpsellerProduct[] = [];

    const maxPages = 100;

    for (let page = 1; page <= maxPages; page++) {
      const products = await this.getProductsPage(page);

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

  const data: JumpsellerProductResponse[] = await response.json();

  if (data.length === 0) {
    return null;
  }

  return data[0].product;
}
}