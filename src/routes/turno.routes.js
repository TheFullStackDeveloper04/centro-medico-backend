import express from 'express';
import {
    createTurno,
    getAllTurnos,
    getMisTurnos,
    updateTurnoEstado
} from '../controllers/turno.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// POST /api/turnos (Crear)
// Solo Recepcionista [cite: 37]
router.post(
    '/',
    authMiddleware,
    roleMiddleware('recepcionista'),
    createTurno
);

// GET /api/turnos (Listar todos, con filtros)
// Solo Recepcionista (para gestionar)
router.get(
    '/',
    authMiddleware,
    roleMiddleware('recepcionista'), // Asumimos que solo recepcionista necesita ver todo
    getAllTurnos
);

// GET /api/turnos/mis-turnos (Listar mis turnos)
// Solo Medico 
router.get(
    '/mis-turnos',
    authMiddleware,
    roleMiddleware('medico'),
    getMisTurnos
);

// PATCH /api/turnos/:id/estado (Actualizar estado)
// Medico (para sus turnos) y Recepcionista (para cancelar) [cite: 20, 37]
router.patch(
    '/:id/estado',
    authMiddleware,
    roleMiddleware('medico', 'recepcionista'),
    updateTurnoEstado
);

export default router;