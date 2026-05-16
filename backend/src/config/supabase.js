import {createClient} from "@supabase/supabase-js";

/**
 * Cria um cliente para o servidor com as variáveis de .env
 * 
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
console.log("URL do Supabase:", process.env.SUPABASE_URL); // Deve mostrar o link
console.log("Chave carregada:", !!process.env.SUPABASE_SERVICE_ROLE_KEY); // Deve mostrar true
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabaseAdmin;