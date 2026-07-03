import express from "express";
const router = express.Router();

import clientRoutes from "./clients.route.js";
import adminRoutes from "./admin.route.js";
import authRoutes from "./auth.route.js";

router.use("/", authRoutes);
router.use("/", clientRoutes);
router.use("/admin", adminRoutes);

export default router;