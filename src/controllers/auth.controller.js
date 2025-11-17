import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Autenticar (loguear) un usuario y obtener un token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    // 1. Obtener email y password del body
    const { email, password } = req.body;

    try {
        // 2. Verificar si el usuario existe por su email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas (email)' });
        }

        // 3. Comparar la contraseña ingresada con la hasheada en la BD
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas (password)' });
        }

        // 4. Si todo está OK, generar un token
        const token = generateToken(user._id, user.rol);

        // 5. Responder al cliente con el token y los datos del usuario
        res.json({
            message: 'Login exitoso',
            token,
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