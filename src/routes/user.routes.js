import express from 'express';
import { createUser } from '../controllers/user.controller.js';

// --- 1. IMPORTAR MIDDLEWARES ---
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// --- 2. APLICAR MIDDLEWARES ---
// POST /api/users
router.post(
    '/',
    authMiddleware,           // 1ro: Verifica que el token sea válido
    roleMiddleware('admin'),  // 2do: Verifica que el rol sea 'admin'
    createUser                // 3ro: Si todo está bien, ejecuta el controlador
);

export default router;