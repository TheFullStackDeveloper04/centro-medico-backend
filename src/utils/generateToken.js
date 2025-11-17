import jwt from 'jsonwebtoken';

// Esta función crea el token
const generateToken = (userId, userRole) => {
    // El "payload" es la información que guardamos dentro del token
    const payload = {
        id: userId,
        rol: userRole,
    };

    // Firmamos el token con nuestra clave secreta y le damos una expiración
    return jwt.sign(
        payload,
        process.env.JWT_SECRET, // ¡Necesitaremos añadir esto al .env!
        { expiresIn: '1d' } // El token será válido por 1 día
    );
};

export default generateToken;