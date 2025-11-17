import express from 'express';
// 1. Importar las nuevas funciones
import {
    createPaciente,
    getPacientes,
    updatePaciente,
    deletePaciente
} from '../controllers/paciente.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// --- Definición de Rutas ---

// POST /api/pacientes (Crear)
// Protegido: Solo Recepcionista
router.post(
    '/',
    authMiddleware,
    roleMiddleware('recepcionista'),
    createPaciente
);

// GET /api/pacientes (Listar)
// Protegido: Recepcionista y Medico
router.get(
    '/',
    authMiddleware,
    roleMiddleware('recepcionista', 'medico'),
    getPacientes
);

// PUT /api/pacientes/:id (Actualizar)
// Protegido: Solo Recepcionista
router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('recepcionista'),
    updatePaciente
);

// DELETE /api/pacientes/:id (Eliminar)
// Protegido: Solo Recepcionista
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('recepcionista'),
    deletePaciente
);

export default router;