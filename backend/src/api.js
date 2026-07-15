import "dotenv/config";

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import routerClients from "./api/clients/index.js";

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

app.use("/api", routerClients);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
