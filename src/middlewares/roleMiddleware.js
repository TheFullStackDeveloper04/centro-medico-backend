/**
 * @desc    Middleware para verificar roles de usuario.
 * @param   {...string} allowedRoles - Lista de roles permitidos (ej. 'admin', 'medico')
 */
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user es establecido por el authMiddleware anterior
        if (!req.user || !allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({
                message: `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`
            });
        }

        // El usuario tiene el rol correcto, continuar.
        next();
    };
};

export default roleMiddleware;