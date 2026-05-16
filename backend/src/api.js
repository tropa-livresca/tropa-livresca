import "dotenv/config";
import express from "express";
import cors from "cors";
import supabaseAdmin from "./config/supabase.js";

const app = express();

// Configuração corrigida do CORS
app.use(cors({
    origin: "http://localhost:5173" 
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rota atualizada para /health se preferir o padrão, ou mantenha /ver
app.get('/health', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin.from('users_profile').select('*').limit(1);
        if (error) {
            throw error;
        }
        res.status(200).json({ status: 'ok', data });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
