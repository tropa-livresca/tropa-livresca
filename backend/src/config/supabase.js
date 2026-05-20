import {createClient} from "@supabase/supabase-js";

/**
 * Cria um cliente para o servidor com as variáveis de .env
 * 
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export { supabaseAdmin };
export default supabase;