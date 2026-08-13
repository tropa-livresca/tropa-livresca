import { Router } from "express";

import funcionarioRoutes from "./funcionarios/funcionarios.route.js";

const router = Router();

router.use("/funcionarios", funcionarioRoutes);

export default router;
