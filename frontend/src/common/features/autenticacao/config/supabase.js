import ws from 'ws'
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SERVICE_ROLE_KEY;
const anomKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log(supabaseUrl);
console.log(serviceRoleKey);
console.log(anomKey);

if (!supabaseUrl || !serviceRoleKey || !anomKey) {
  throw new Error("Erro crítico: Variáveis de ambiente do Supabase não encontradas no process.env");
}

const supabaseOptions = {
  auth: { persistSession: false },
  realtime: {
    transport: ws,
  },
};

const supabase = await createClient(
  supabaseUrl,
  anomKey,
  supabaseOptions
);

export default supabase;
