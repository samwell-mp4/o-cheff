import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mm2Items from '../src/data/mm2Items.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega as credenciais que você baixou
const keyFile = path.join(__dirname, '../google-credentials.json');

if (!fs.existsSync(keyFile)) {
  console.error('❌ Erro: O arquivo google-credentials.json não foi encontrado na raiz do projeto.');
  console.log('Siga as instruções para baixar o JSON do Google Cloud Console.');
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyFile, 'utf8'));

const batchIndex = async (urls) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFile,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    const jwtClient = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: jwtClient });
    
    console.log('✅ Autorizado no Google com sucesso!');

    for (const url of urls) {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        }
      });
      console.log(`🚀 Indexação solicitada para: ${url} (Status: ${res.status})`);
    }
    
    console.log('\n✨ Processo finalizado! O Google agora processará suas URLs prioritariamente.');
  } catch (error) {
    console.error('❌ Erro na indexação:', error.message);
  }
};

const urlsToIndex = [
  'https://chefaodoscards.shop/',
  'https://www.chefaodoscards.shop/',
  'https://chefaodoscards.shop/shop',
  ...mm2Items.slice(0, 5).map(item => `https://chefaodoscards.shop/produto/${item.slug}`)
];

batchIndex(urlsToIndex);
