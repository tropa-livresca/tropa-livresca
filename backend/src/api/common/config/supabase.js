import ws from 'ws'
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Erro crítico: Variáveis de ambiente do Supabase não encontradas no process.env");
}

const supabaseOptions = {
  auth: { persistSession: false },
  realtime: {
    transport: ws,
  },
};

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseOptions
);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  supabaseOptions
);

export { supabaseAdmin };
export default supabase;
