const { uploader } = require('../utils')
import {uploader} from '../utils.js'

const multerFields = uploader.fields([
    { name: 'imagenPerfil', maxCount: 1 },
    { name: 'imagenProducto', maxCount: 1 },
    { name: 'documents', maxCount: 3 }
])

module.exports = multerFields