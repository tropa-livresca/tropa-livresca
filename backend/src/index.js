/**
 * Configuração e inicialização do servidor Express.
 * @module Server
 */

const result = require('dotenv').config(); 
const express = require('express');
const path = require('node:path');
const cors = require('cors');

const { supabaseAdmin } = require('./config/supabase'); 

/** @type {import('express').Express} */
const app = express();

app.use(cors());
app.use(express.json());

/** @type {string|number} Porto onde o servidor será executado. */
const PORT = process.env.PORT || 3000;

/**
 * Endpoint de verificação de saúde do sistema e conexão com o banco.
 * @name HealthCheck
 * @path {GET} /health
 * @response {Object} 200 - Objeto contendo o status da conexão.
 * @response {Object} 500 - Objeto contendo detalhes do erro.
 */
app.get('/health', async (req, res) => {
    try {
        // Nota: No seu código estava 'supabase', mudei para 'supabaseAdmin' para manter a consistência
        const { data, error } = await supabaseAdmin.from('usuarios').select('count', { count: 'exact', head: true });
        
        if (error) throw error;
        
        res.json({ status: "Conectado ao Supabase!", info: data });
    } catch (err) {
        res.status(500).json({ status: "Erro na conexão", erro: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
