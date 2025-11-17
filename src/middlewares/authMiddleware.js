import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
    let token;

    // 1. Leer el token del header
    // El header debe ser "Bearer TOKEN_LARGO"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Obtener solo el token (quitando "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verificar el token con la clave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Obtener el usuario desde la BD (usando el ID del token)
            //    y adjuntarlo al objeto 'req'
            //    Usamos '-password' para que no traiga la contraseña
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
            }

            // 5. Continuar al siguiente middleware o controlador
            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, token inválido' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no se proporcionó token' });
    }
};

export default authMiddleware;