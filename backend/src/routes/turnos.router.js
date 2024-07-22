import express from "express";
import { getTurnos, crearTurno, modificarTurno } from "../controllers/turnos.controller.js";

const router = express.Router();

// Rutas
router.get("/:tel", getTurnos);
router.post("/", crearTurno);
router.put("/:tel", modificarTurno);

export default router
