import { createClient } from '@supabase/supabase-js';
import mm2Items from '../src/data/mm2Items.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://ormbxcjsmbtyonswchkn.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_p7S9Nj3Ur9BFpqhKT9GjUw_rXtgZk6r";

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('🚀 Iniciando migração de ' + mm2Items.length + ' produtos...');

  const formattedItems = mm2Items.map(item => ({
    name: item.name,
    slug: item.slug,
    price: item.price,
    image: item.image,
    category: item.category,
    rarity: item.rarity,
    rarity_color: item.rarityColor,
    stock: 99, // Valor padrão solicitado
    is_active: true
  }));

  const { data, error } = await supabase
    .from('products')
    .upsert(formattedItems, { onConflict: 'slug' });

  if (error) {
    console.error('❌ Erro na migração:', error.message);
  } else {
    console.log('✅ Migração concluída com sucesso!');
  }
}

migrate();
