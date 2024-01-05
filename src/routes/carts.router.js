import Router from './router.js';
import Carts from '../dao/memoryManager/carts.managers.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { addCart, getCartById, addProduct, deleteProduct, deleteAllProducts, updateAllProducts, updateQuantity } from '../controllers/carts.controller.js';
import { processPurchase } from "../controllers/tickets.controller.js";

export default class CartsRouter extends Router {
    constructor() {
        super();
        this.cartManager = new Carts();
    }

    init() {
        //Crea un nuevo carrito
        this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, addCart);

        //Lista los productos del carrito con el id proporcionado
        this.get('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, getCartById);

        //Agrega el producto seleccionado al carrito seleccionado 
        this.post('/:cid/product/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, addProduct);

        //Elimina del carrito elegido el producto seleccionado
        this.delete('/:cid/products/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteProduct);
        
        //Actualiza el carrito con un arreglo de productos
        this.put('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, updateAllProducts);
        
        //Actualiza SOLO la cantidad de ejemplares del producto seleccionado del carrito elegido
        this.put('/:cid/products/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, updateQuantity);

        //Elimina todos los productos del carrito seleccionado
        this.delete('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteAllProducts);

        //Finalizar proceso de compra de dicho carrito
        this.post('/:cid/purchase', [accessRolesEnum.USER], passportStrategiesEnum.JWT, processPurchase)
    }  
}