import Router from 'express';
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { addCart, getCartById, addProduct, deleteProduct, deleteAllProducts, updateAllProducts, updateQuantity } from '../controllers/carts.controller.js';
import { processPurchase } from "../controllers/tickets.controller.js";
import { passportCall } from '../config/passport.config.js';
import { handlePolicies } from '../middlewares/authJwt.js';


const router = Router();

//Crea un nuevo carrito
router.post('/', passportCall(passportStrategiesEnum.JWT), addCart);

//Lista los productos del carrito con el id proporcionado
router.get('/:cid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER]), getCartById);

//Agrega el producto seleccionado al carrito seleccionado 
router.post('/:cid/product/:pid', passportCall(passportStrategiesEnum.JWT, addProduct));

//Elimina del carrito elegido el producto seleccionado
router.delete('/:cid/products/:pid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER]), deleteProduct);

//Actualiza el carrito con un arreglo de productos
router.put('/:cid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER]), updateAllProducts);

//Actualiza SOLO la cantidad de ejemplares del producto seleccionado del carrito elegido
router.put('/:cid/products/:pid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER]), updateQuantity)

//Elimina todos los productos del carrito seleccionado
router.delete('/:cid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER]), deleteAllProducts);

//Finalizar proceso de compra de dicho carrito
router.post('/:cid/purchase', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER]), processPurchase);

export default router;