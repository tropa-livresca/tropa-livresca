const { createClient } = require('@supabase/supabase-js');

/**
 * Cria um cliente para o servidor com as variáveis de .env
 * 
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = {supabaseAdmin};
