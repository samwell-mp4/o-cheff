import express from 'express';
import cors from 'cors';
import path from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import mm2Items from './src/data/mm2Items.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Mercado Pago integration (already done)
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

app.post('/api/create-pix', async (req, res) => {
  const { total, items, buyer, userId } = req.body;
  
  const [firstName, ...lastNameParts] = buyer.name.trim().split(' ');
  const lastName = lastNameParts.join(' ') || 'Cliente';

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
          identification: {
            type: 'CPF',
            number: '00000000000'
          }
        },
        metadata: {
          user_id: userId,
          roblox_nick: buyer.robloxNick
        }
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
    console.error(error);
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

// Serving static files
app.use(express.static(join(__dirname, 'dist')));

// --- DYNAMIC SEO INJECTION ---
const indexHtml = fs.readFileSync(join(__dirname, 'dist', 'index.html'), 'utf8');

app.get('/item/:id', (req, res) => {
  const item = mm2Items.find(i => i.id === parseInt(req.params.id));
  if (item) {
    let modifiedHtml = indexHtml
      .replace(/<title>.*?<\/title>/, `<title>${item.name} | O Chefão dos Cards</title>`)
      .replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${item.name} | Loja O Chefão dos Cards" />`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="Compre ${item.name} (${item.category}) de Murder Mystery 2 com o melhor preço. Entrega imediata pelo Chefão!" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${item.name} | O Chefão dos Cards" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="Compre ${item.name} com entrega rápida e garantida. O melhor preço do Brasil em itens MM2!" />`)
      .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${item.image}" />`)
      .replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${item.name} | O Chefão dos Cards" />`)
      .replace(/<meta property="twitter:description" content=".*?" \/>/, `<meta property="twitter:description" content="Compre ${item.name} com entrega rápida e garantida." />`)
      .replace(/<meta property="twitter:image" content=".*?" \/>/, `<meta property="twitter:image" content="${item.image}" />`);
    
    return res.send(modifiedHtml);
  }
  res.send(indexHtml);
});

// SPA handle - all other routes to index.html
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de produção rodando na porta ${PORT}`);
});
