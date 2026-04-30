// 1. CARREGAR O ENV ANTES DE QUALQUER OUTRA COISA
const result = require('dotenv').config(); 

const express = require('express');
const path = require('node:path');
const cors = require('cors');
console.log("a")
const supabase = require('./supabase'); // Agora, quando ele for lido, as variáveis já existem
const rotaUsuario = require('./rotas/rotaUsuario');
//banana

if (result.error) {
  console.error("ERRO AO CARREGAR .ENV:", result.error);
}

console.log("Variáveis carregadas:", {
  URL: process.env.SUPABASE_URL,
  KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Definida" : "Faltando"
});

const app = express();

app.use(cors());
app.use(express.json());

app.set("views", path.join(__dirname, "tropa-livresca"));
app.set("view engine", "ejs");

app.use("/", rotaUsuario);

const PORT = process.env.PORT || 3000;

app.get('/health', async (req, res) => {
    try {
        // Tenta buscar o nome de qualquer tabela ou apenas uma contagem
        const { data, error } = await supabase.from('usuarios').select('count', { count: 'exact', head: true });
        
        if (error) throw error;
        
        res.json({ status: "Conectado ao Supabase!", info: data });
    } catch (err) {
        res.status(500).json({ status: "Erro na conexão", erro: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
