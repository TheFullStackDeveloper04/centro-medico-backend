// src/controllers/user.controller.js
import User from '../models/User.js'; // <-- ESTA LÍNEA ES LA CLAVE

/**
 * @desc    Crear un nuevo usuario (Admin, Medico, Recepcionista)
 * @route   POST /api/users
 * @access  Private (Admin)
 */
export const createUser = async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const user = await User.create({
            nombre,
            email,
            password,
            rol,
        });
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

/**
 * @desc    Obtener todos los usuarios (listado)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

/**
 * @desc    Obtener solo los usuarios con rol 'medico'
 * @route   GET /api/users/medicos
 * @access  Private (Recepcionista)
 */
export const getMedicos = async (req, res) => {
    try {
        const medicos = await User.find({ rol: 'medico' }).select('-password -rol');
        res.status(200).json(medicos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};



/**
 * @desc    Eliminar un usuario por ID
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Evitar que el admin se elimine a sí mismo
    if (req.user.id === id) {
       return res.status(400).json({ message: 'No puede eliminar su propia cuenta de administrador' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};