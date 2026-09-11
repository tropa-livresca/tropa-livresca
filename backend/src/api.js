import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import routerClients from "./api/clients/index.js";
import routerAdmin from "./api/admin/index.js";
import routerAuth from "./api/common/auth/auth.route.js";
import { errorHandler } from "./api/common/middlewares/error.middleware.js";

const app = express();

/* 
// VERSÃO ANTERIOR (Validação restrita de origens):
const allowedOrigins = [
  "https://tropa-livresca.vercel.app",
  "http://localhost:5173",
];

const corsOptionsAnterior = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const originHostname = new URL(origin).hostname;

    const isAllowed =
      allowedOrigins.includes(origin) ||
      originHostname.endsWith(".app.github.dev") ||
      originHostname.endsWith(".vercel.app");

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Bloqueado pelo CORS: A origem ${origin} não é permitida.`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
*/

// VERSÃO ATUAL: Liberado para qualquer origem mantendo suporte a cookies/credentials

app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/v1/clients", routerClients);
app.use("/api/v1/admin", routerAdmin);
app.use("/api/v1/auth", routerAuth);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});

export default app;