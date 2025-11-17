import express from 'express';
// 1. Importar las nuevas funciones
import {
    createTurno,
    getAllTurnos,
    getMisTurnos,
    updateTurnoEstado,
    updateTurno,
    deleteTurno
} from '../controllers/turno.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// POST /api/turnos (Crear)
router.post(
    '/',
    authMiddleware,
    roleMiddleware('recepcionista'),
    createTurno
);

// GET /api/turnos (Listar todos)
router.get(
    '/',
    authMiddleware,
    roleMiddleware('recepcionista'),
    getAllTurnos
);

// GET /api/turnos/mis-turnos (Médico)
router.get(
    '/mis-turnos',
    authMiddleware,
    roleMiddleware('medico'),
    getMisTurnos
);

// PATCH /api/turnos/:id/estado (Actualizar solo estado)
router.patch(
    '/:id/estado',
    authMiddleware,
    roleMiddleware('medico', 'recepcionista'),
    updateTurnoEstado
);

// PUT /api/turnos/:id (Actualizar turno completo)
// Protegido: Solo Recepcionista
router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('recepcionista'),
    updateTurno
);

// DELETE /api/turnos/:id (Eliminar turno)
// Protegido: Solo Recepcionista
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('recepcionista'),
    deleteTurno
);

export default router;