import 'dotenv/config';

const loginKey = process.env.JUMPSELLER_LOGIN_KEY;
const authToken = process.env.JUMPSELLER_AUTH_TOKEN;

const sku = '9786075783734';

const params = new URLSearchParams({
  login: loginKey!,
  authtoken: authToken!,
  query: sku,
});

const url =
  `https://api.jumpseller.com/v1/products/search.json?${params.toString()}`;

console.log('Consultando SKU:', sku);
console.log('URL:', url.replace(authToken!, '***'));

const response = await fetch(url);

console.log('HTTP:', response.status);

const data = await response.json();

console.log('Respuesta:');
console.dir(data, { depth: null });


/**
import 'dotenv/config';

const loginKey = process.env.JUMPSELLER_LOGIN_KEY;
const authToken = process.env.JUMPSELLER_AUTH_TOKEN;

const params = new URLSearchParams({
  login: loginKey!,
  authtoken: authToken!,
});

const url =
  `https://api.jumpseller.com/v1/products.json?${params.toString()}`;

const response = await fetch(url);

console.log('HTTP:', response.status);

const data = await response.json();

console.log('Es array:', Array.isArray(data));
console.log('Cantidad:', data.length);

console.log('\nClaves del primer elemento:');
console.log(Object.keys(data[0]));

console.log('\nClaves del producto:');
console.log(Object.keys(data[0].product));

console.log('\nPrimer producto resumido:');
console.dir(
  {
    id: data[0].product.id,
    name: data[0].product.name,
    sku: data[0].product.sku,
    barcode: data[0].product.barcode,
    brand: data[0].product.brand,
    categories: data[0].product.categories,
    images: data[0].product.images,
  },
  { depth: null },
);

================ */


/*
import 'dotenv/config';

const login = process.env.JUMPSELLER_LOGIN_KEY;
const authtoken = process.env.JUMPSELLER_AUTH_TOKEN;

const sku = '9788416244027';

const url =
  'https://api.jumpseller.com/v1/products.json' +
  `?login=${encodeURIComponent(login!)}` +
  `&authtoken=${encodeURIComponent(authtoken!)}` +
  //`&barcode=${encodeURIComponent(sku)}`;
  `&page=2`;

console.log('URL consultada:', url.replace(authtoken!, '***'));

const response = await fetch(url);

console.log('Status:', response.status);

const text = await response.text();

console.log('Respuesta:');
console.dir(JSON.parse(text), { depth: 5 });

*/