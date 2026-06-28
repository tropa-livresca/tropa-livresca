import "dotenv/config";

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import livrosRoutes from "./routes/livros.route.js";
import perfilRoutes from "./routes/perfil.route.js";
import autorRoutes from "./routes/autor.route.js";
import suporteRoutes from "./routes/suporte.route.js";

const app = express();

const allowedOrigins = [
  "https://vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".app.github.dev")) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api", authRoutes);
app.use("/api", livrosRoutes);
app.use("/api", perfilRoutes);  
app.use("/api", autorRoutes);
app.use("/api", suporteRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
