import 'dotenv/config';

import { JumpsellerClient } from '../jumpseller/jumpseller.client.js';
import { SpookyAdapter } from './spooky.adapter.js';

const client = new JumpsellerClient();
const adapter = new SpookyAdapter();

const skus = [
  '9788418309762',
  '9786075783734',
  '9789583204074',
  '9791388178979',
  '9788411403542',
  '9788419972132',
  '9788410350427',
  '9786075784021',
  '9788498855142',
];

for (const sku of skus) {
  console.log('\n========================================');
  console.log(`SKU: ${sku}`);
  console.log('========================================');

  const product = await client.searchProductBySKU(sku);

  if (!product) {
    console.log('❌ Producto no encontrado');
    continue;
  }

  console.log('Producto encontrado:');
  console.log(`  Nombre: ${product.name}`);
  console.log(`  SKU: ${product.sku}`);
  console.log(`  Marca: ${product.brand}`);

  try {
    const normalized = adapter.normalize(product);

    console.log('\n✅ Normalizado:');
    console.dir(normalized, { depth: null });
  } catch (error) {
    console.log('\n⚠️ Producto rechazado por el Adapter:');
    console.log((error as Error).message);
  }
}
/*
import 'dotenv/config';

import { JumpsellerClient } from '../jumpseller/jumpseller.client.js';

const client = new JumpsellerClient();

const page1 = await client.getProductsPage(1);
const page2 = await client.getProductsPage(2);

console.log('Página 1:', page1.length);
console.log('Página 2:', page2.length);

console.log('\nPrimer producto página 1:');
console.log(page1[0]?.name);

console.log('\nPrimer producto página 2:');
console.log(page2[0]?.name);


==========*/

/* 
import 'dotenv/config';

import { JumpsellerClient } from '../jumpseller/jumpseller.client.js';
import { SpookyAdapter } from './spooky.adapter.js';


const client = new JumpsellerClient();
const adapter = new SpookyAdapter();

const products = await client.getProductsBySku('9786075783734');

//console.dir(products, { depth: 3 });
const normalized = adapter.normalize(products[0]);

console.dir(normalized, { depth: null });

======================================= */

/**
if (products.length === 0) {
  throw new Error('No se encontró el producto.');
}

console.dir(products[0], { depth: 3 });
const normalized = adapter.normalize(products[0]);

console.dir(normalized, { depth: null });
*/