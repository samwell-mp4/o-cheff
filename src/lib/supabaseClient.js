import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ormbxcjsmbtyonswchkn.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_p7S9Nj3Ur9BFpqhKT9GjUw_rXtgZk6r";

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn("AVISO: Usando credenciais de fallback para o Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
