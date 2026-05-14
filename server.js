import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

const payment = new Payment(client);

// API Endpoints
app.post('/api/create-pix', async (req, res) => {
  try {
    const { total, items, buyer } = req.body;
    const [firstName, ...rest] = buyer.name.split(' ');
    const lastName = rest.join(' ') || 'Cliente';

    const body = {
      transaction_amount: Number(total),
      description: `Pedido Chefão - ${items[0].name.substring(0, 20)}`,
      payment_method_id: 'pix',
      payer: {
        email: buyer.email,
        first_name: firstName,
        last_name: lastName
      },
      metadata: {
        roblox_nick: buyer.robloxNick,
        whatsapp: buyer.whatsapp
      }
    };

    const response = await payment.create({ body });
    
    res.json({
      id: response.id,
      status: response.status,
      qr_code: response.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
    });
  } catch (error) {
    console.error('Erro MP:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/check-payment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await payment.get({ id });
    res.json({ status: response.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA handle - all other routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de produção rodando na porta ${PORT}`);
});
