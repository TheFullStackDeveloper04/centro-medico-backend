import express from 'express';
import { createPaciente, getPacientes } from '../controllers/paciente.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// --- Definición de Rutas ---

// POST /api/pacientes
// Protegido: Solo Recepcionista
router.post(
    '/',
    authMiddleware,
    roleMiddleware('recepcionista'),
    createPaciente
);

// GET /api/pacientes
// Protegido: Recepcionista y Medico
router.get(
    '/',
    authMiddleware,
    roleMiddleware('recepcionista', 'medico'),
    getPacientes
);

export default router;