import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import mm2Items from './src/data/mm2Items.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('--- INICIANDO SERVIDOR ELITE v2.6 [BUILD: ' + new Date().toISOString() + '] ---');

const app = express();
app.use(cors());
app.use(express.json());

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

// API Routes
app.post('/api/create-pix', async (req, res) => {
  const { total, items, buyer, userId } = req.body;
  const [firstName, ...lastNameParts] = (buyer.name || 'Cliente').trim().split(' ');
  const lastName = lastNameParts.join(' ') || 'Fiel';

  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': Math.random().toString(36).substring(7)
      },
      body: JSON.stringify({
        transaction_amount: total,
        description: `O Chefão - ${items.length} itens MM2`,
        payment_method_id: 'pix',
        payer: {
          email: buyer.email,
          first_name: firstName,
          last_name: lastName,
          identification: { type: 'CPF', number: '00000000000' }
        },
        metadata: { user_id: userId, roblox_nick: buyer.robloxNick }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro no Mercado Pago');

    res.json({
      id: data.id,
      qr_code: data.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64,
      status: data.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/check-payment/:id', async (req, res) => {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
    });
    const data = await response.json();
    res.json({ status: data.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Static files
app.use(express.static(join(__dirname, 'dist')));

// --- ADVANCED DYNAMIC SEO INJECTION ---
const indexHtml = fs.readFileSync(join(__dirname, 'dist', 'index.html'), 'utf8');

app.get('/produto/:slug', (req, res) => {
  const item = mm2Items.find(i => i.slug === req.params.slug);
  if (item) {
    const title = `${item.name} | Comprar ${item.name} Original com Garantia`;
    const description = `Compre ${item.name} original (${item.category}) com entrega rápida, garantia e segurança. Confira preços e estoque disponível no Chefão dos Cards.`;
    const url = `https://chefaodoscards.com.br/produto/${item.slug}`;
    
    let modifiedHtml = indexHtml
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="title" content=".*?" \/>/g, `<meta name="title" content="${title}" />`)
      .replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${description}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${description}" />`)
      .replace(/<meta property="og:image" content=".*?" \/>/g, `<meta property="og:image" content="${item.image}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${url}" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/g, `<meta name="twitter:title" content="${title}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/g, `<meta name="twitter:description" content="${description}" />`)
      .replace(/<meta name="twitter:image" content=".*?" \/>/g, `<meta name="twitter:image" content="${item.image}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/g, `<link rel="canonical" href="${url}" />`);
    
    return res.send(modifiedHtml);
  }
  res.send(indexHtml);
});

// SPA Fallback
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('>>> SISTEMA O CHEFÃO ONLINE - v2.7 - PORTA: ' + PORT);
  console.log('>>> AGUARDANDO COMANDOS DE ELITE...');
});
