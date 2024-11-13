const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticar tokens JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1]; // Maneja 'Bearer <token>'
    
    // Logging para debugging
    console.log('[Auth Middleware] Verificando token...');
    
    // Validar presencia del token
    if (!token) {
      console.log('[Auth Middleware] Token no proporcionado');
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no proporcionado.',
        error: 'NO_TOKEN'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Enriquecer el objeto request con información del usuario
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      // Agrega aquí otros campos que necesites del token
    };
    
    console.log('[Auth Middleware] Token válido para usuario:', {
      userId: decoded.id,
      role: decoded.role
    });
    
    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error.message);
    
    // Manejar diferentes tipos de errores JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token malformado o inválido',
        error: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'El token ha expirado',
        error: 'TOKEN_EXPIRED'
      });
    }

    // Error genérico
    return res.status(401).json({
      success: false,
      message: 'Error en la autenticación',
      error: 'AUTH_ERROR'
    });
  }
};

// Middleware opcional para verificar roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        error: 'NO_AUTH'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para acceder a este recurso',
        error: 'FORBIDDEN'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};