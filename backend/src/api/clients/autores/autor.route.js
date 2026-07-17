import express from "express";
import {GetAutores, GetAutorById} from "./autor.controller.js";

const router = express.Router();

router.get("/", GetAutores);
router.get("/:id", GetAutorById);

export default router;