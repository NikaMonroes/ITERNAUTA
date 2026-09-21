export interface JumpsellerProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string | null;
  barcode: string | null;
  brand: string | null;
  status: string;
  permalink: string | null;
  categories: Array<{
    name: string;
  }>;
  images: Array<{
    url: string;
  }>;
}

export interface JumpsellerProductResponse {
  product: JumpsellerProduct;
}