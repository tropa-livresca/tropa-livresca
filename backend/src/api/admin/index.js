import { Router } from "express";

import authRoutes from "./auth/auth.route.js";
import funcionarioRoutes from "./funcionarios/funcionarios.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/funcionarios", funcionarioRoutes);

export default router;
