import 'dotenv/config';

const loginKey = process.env.JUMPSELLER_LOGIN_KEY;
const authToken = process.env.JUMPSELLER_AUTH_TOKEN;

const barcode = '9788498855142';

const url =
  'https://api.jumpseller.com/v1/products.json' +
  `?login=${encodeURIComponent(loginKey!)}` +
  `&authtoken=${encodeURIComponent(authToken!)}` +
  `&barcode=${encodeURIComponent(barcode)}`;

const response = await fetch(url);

console.log('Status:', response.status);
console.log('Respuesta:', await response.text());
console.log('Login empieza:', loginKey?.slice(0, 4));
console.log('Login termina:', loginKey?.slice(-4));
console.log('Token empieza:', authToken?.slice(0, 4));
console.log('Token termina:', authToken?.slice(-4));
