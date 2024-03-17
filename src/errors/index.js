// Middleware para manejar errores y enviar respuestas adecuadas según el código de error.
import EErrors from "./enums.js";

export default (error, req, res, next) => {
    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case EErrors.DATABASE_ERROR:
            res.status(500).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case EErrors.INTERNAL_SERVER_ERROR:
            res.status(500).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case EErrors.USER_NOT_FOUND:
            res.status(404).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case EErrors.PRODUCT_NOT_FOUND:
            res.status(404).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case EErrors.CART_NOT_FOUND:
            res.status(404).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case EErrors.PERMISSION_DENIED:
            res.status(403).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case EErrors.EXCEEDED_STOCK:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        default:
            res.status(500).send({
                status: 'error',
                error: error.name,
                description: error.cause
            })
    }
    next();
}