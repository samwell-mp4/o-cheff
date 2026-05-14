const https = require('https');

const BASE_URL = 'https://chefaodoscards.shop';
// Substitua pela sua chave do IndexNow (você gera no site do Bing Webmaster Tools)
const INDEX_NOW_KEY = 'SUA_CHAVE_AQUI'; 

const urlsToPing = [
  BASE_URL,
  `${BASE_URL}/shop`,
  // Adicione URLs de produtos novos aqui se quiser pilar individualmente
];

const pingIndexNow = () => {
  const data = JSON.stringify({
    host: 'chefaodoscards.shop',
    key: INDEX_NOW_KEY,
    keyLocation: `${BASE_URL}/${INDEX_NOW_KEY}.txt`,
    urlList: urlsToPing
  });

  const options = {
    hostname: 'api.indexnow.org',
    path: '/IndexNow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    console.log(`📡 Status do Ping: ${res.statusCode}`);
  });

  req.on('error', (error) => {
    console.error('❌ Erro no Ping:', error);
  });

  req.write(data);
  req.end();
};

console.log('🚀 Iniciando indexação instantânea...');
pingIndexNow();
