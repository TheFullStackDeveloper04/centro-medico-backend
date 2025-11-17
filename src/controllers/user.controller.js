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