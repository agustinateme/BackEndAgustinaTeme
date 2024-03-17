// Clase utilitaria para crear errores personalizados con nombre, causa, mensaje y código.
export default class CustomError {
    static createError({ name = 'Error', cause, message, code = 1 }) {
        let error = new Error( message, { cause });
        error.name = name;
        error.code = code;
        return error;
    }
}