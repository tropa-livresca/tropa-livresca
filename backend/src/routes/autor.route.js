import express from "express";
import {GetAutores, GetAutorById} from "../controllers/autor.controller.js";

const router = express.Router();

router.get("/autores/", GetAutores);
router.get("/autores/:id", GetAutorById);

export default router;