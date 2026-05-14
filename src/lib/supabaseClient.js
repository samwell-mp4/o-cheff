import { createClient } from '@supabase/supabase-js';

// Chaves de contingência caso o .env falhe
const URL_FALLBACK = "https://ormbxcjsmbtyonswchkn.supabase.co";
const KEY_FALLBACK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ybWJ4Y2pzbWJ0eW9uc3djaGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDM4NDAsImV4cCI6MjA5NDI3OTg0MH0.SEopFo2QA3mqsgYtMbHAi1aKNjjfa0R-5E6L3hvPaE0";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || URL_FALLBACK;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || KEY_FALLBACK;

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn("AVISO: Usando credenciais de fallback para o Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
