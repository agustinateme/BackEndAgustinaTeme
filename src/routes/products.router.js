import Router from 'express';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct, mockingProducts } from '../controllers/products.controller.js';
import { passportCall } from '../config/passport.config.js';
import { handlePolicies } from '../middlewares/authJwt.js';

const router = Router();

//Lista todos los productos de la base de datos
router.get('/', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), getProducts);

//Trae solo el producto con el id proporcionado
router.get('/:pid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), getProductById)

//Agrega un producto
router.post('/', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), addProduct);

//Toma un producto y lo atualiza por los campos enviados desde el body
router.put('/:pid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), updateProduct);

//Elimina el producto con el id indicado
router.delete(':/pid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), deleteProduct);
    
//Mocking y manejo de errores
router.get('/mockingproducts', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), mockingProducts);    
