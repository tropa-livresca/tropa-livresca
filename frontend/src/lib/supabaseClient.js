import { createClient } from '@supabase/supabase-js'

/** 
 * URL do projeto Supabase obtida das variáveis de ambiente 
 * @type {string} 
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

/** 
 * Chave anônima do Supabase obtida das variáveis de ambiente 
 * @type {string} 
 */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Cliente instanciado do Supabase para comunicação com o Backend.
 * Provê acesso a Auth, Database (PostgREST), Storage e Realtime.
 * 
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Log de depuração (recomenda-se remover antes do deploy para produção)
if (import.meta.env.DEV) {
  console.log("Supabase inicializado:", supabaseUrl);
}
