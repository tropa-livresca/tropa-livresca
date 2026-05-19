import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
const app = express();

// Configuração corrigida do CORS
app.use(cors({
    origin: "http://localhost:5173", credentials: true,
    origin: "https://organic-orbit-x5x6v4wwjrxrh6jg-5173.app.github.dev/", credentials:true
}));

app.use(express.json());

app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
