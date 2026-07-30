import express from "express";
import {AutorController} from "./autor.controller.js";

const router = express.Router();

router.get("/", AutorController.GetAutores);
router.get("/:id", AutorController.GetAutorById);

export default router;