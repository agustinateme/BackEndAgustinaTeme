import { uploader } from '../utils.js';

export const multerFields = uploader.fields([
    { name: 'imagenPerfil', maxCount: 1 },
    { name: 'imagenProducto', maxCount: 1 },
    { name: 'documents', maxCount: 3 }
]);