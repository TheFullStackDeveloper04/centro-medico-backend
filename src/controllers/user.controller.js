import User from '../models/User.js';

/**
 * @desc    Crear un nuevo usuario (Admin, Medico, Recepcionista)
 * @route   POST /api/users
 * @access  Private (Admin) - (Lo protegeremos en el siguiente paso)
 */
export const createUser = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    try {
        // 1. Verificar si el email ya existe
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // 2. Crear el nuevo usuario
        // (El hasheo de contraseña ocurre automáticamente gracias al middleware 'pre-save' en el Modelo)
        const user = await User.create({
            nombre,
            email,
            password,
            rol,
        });

        // 3. Responder
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
        // Buscamos todos los usuarios, pero no enviamos la contraseña
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
        // Buscamos usuarios filtrando por el rol 'medico'
        const medicos = await User.find({ rol: 'medico' }).select('-password -rol'); // No es necesario enviar el rol o pass
        res.status(200).json(medicos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};