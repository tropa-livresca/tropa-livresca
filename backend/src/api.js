import "dotenv/config";

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import routerClients from "./api/clients/index.js";
import {errorHandler} from "./api/common/middlewares/error.middleware.js";

const app = express();

const allowedOrigins = [
  "https://vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".app.github.dev") || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/v1/clients", routerClients);

// Substitua o bloco de depuração antigo por este no final do seu api.js (antes do app.listen):
app._router?.stack?.forEach((r) => {
  if (r.route) {
    console.log(`[Rota Ativa] ${Object.keys(r.route.methods).toUpperCase()} ${r.route.path}`);
  } else if (r.name === 'router' && r.handle?.stack) {
    r.handle.stack.forEach((subR) => {
      if (subR.route) {
        console.log(`[Rota Ativa] /api/v1/clients${subR.route.path}`);
      }
    });
  }
});
app.get("/teste", (req, res) => res.send("Express está funcionando!"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});

export default app;

