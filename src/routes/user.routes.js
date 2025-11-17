// src/routes/user.routes.js
import express from 'express';
import {
    createUser,
    getUsers,
    getMedicos,
    deleteUser
} from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// POST /api/users (Crear)
router.post('/', authMiddleware, roleMiddleware('admin'), createUser);

// GET /api/users (Listar Todos)
router.get('/', authMiddleware, roleMiddleware('admin'), getUsers);

// GET /api/users/medicos (Listar Médicos)
router.get('/medicos', authMiddleware, roleMiddleware('recepcionista'), getMedicos);

// DELETE /api/users/:id (Eliminar Usuario)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser); // <-- Añadir

export default router;