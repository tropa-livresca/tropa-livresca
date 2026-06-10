
import express from "express";
import { GetLivros, GetLivrosById } from "../controllers/livros.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/livros/", GetLivros);
router.get("/meuslivros/", checkAuth, GetLivrosById );

export default router;
