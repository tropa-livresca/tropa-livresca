import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";

import routerClients from "./api/clients/index.js";
import routerAdmin from "./api/admin/index.js";
import routerAuth from "./api/common/auth/auth.route.js";
import { errorHandler } from "./api/common/middlewares/error.middleware.js";

const app = express();

const APP_ROOT = process.env.APP_ROOT
  ? path.resolve(process.env.APP_ROOT)
  : path.resolve(process.cwd(), "..");

const frontendPath = path.join(APP_ROOT, "frontend", "dist");
const frontendIndex = path.join(frontendPath, "index.html");

app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Rotas da API
app.use("/api/v1/clients", routerClients);
app.use("/api/v1/admin", routerAdmin);
app.use("/api/v1/auth", routerAuth);

// Arquivos compilados do React
if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendPath));

  // Fallback para as rotas do React Router.
  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    res.sendFile(frontendIndex);
  });
} else {
  console.warn(
    `[Frontend] Pasta de compilação não encontrada: ${frontendPath}`,
  );
}

app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});

export default app;
