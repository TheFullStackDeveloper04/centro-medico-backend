import express from 'express';
// 1. Importar las nuevas funciones
import {
    createUser,
    getUsers,
    getMedicos
} from '../controllers/user.controller.js';

// Importar middlewares
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// --- Definición de Rutas ---

// POST /api/users (Crear Usuario)
// Protegido: Solo Admin
router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    createUser
);

// GET /api/users (Listar Todos los Usuarios)
// Protegido: Solo Admin
router.get(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    getUsers
);

// GET /api/users/medicos (Listar Médicos)
// Protegido: Solo Recepcionista (para crear turnos)
router.get(
    '/medicos',
    authMiddleware,
    roleMiddleware('recepcionista'),
    getMedicos
);

export default router;