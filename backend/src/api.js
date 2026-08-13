import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import routerClients from "./api/clients/index.js";
import routerAdmin from "./api/admin/index.js";
import routerAuth from "./api/common/auth/auth.route.js";
import { errorHandler } from "./api/common/middlewares/error.middleware.js";

const app = express();

const allowedOrigins = [
  "https://tropa-livresca.vercel.app/",
  "http://localhost:5173",
];

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".app.github.dev") ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  }),
);

app.use("/api/v1/clients", routerClients);
app.use("/api/v1/admin", routerAdmin);
app.use("/api/v1/auth", routerAuth);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});

export default app;
