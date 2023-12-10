import Router from './router.js';
import Carts from '../dao/memoryManager/carts.managers.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { addCart, getCartById, addProduct, deleteProduct, deleteAllProducts, updateAllProducts, updateQuantity } from '../controllers/carts.controller.js';

export default class CartsRouter extends Router {
    constructor() {
        super();
        this.cartManager = new Carts();
    }

    init() {
        this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.addCart);
        this.get('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getCartById);
        this.post('/:cid/product/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.addProduct);
        this.delete('/:cid/products/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteProduct);
        this.put('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.updateAllProducts);
        this.put('/:cid/products/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.updateQuantity);
        this.delete('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteAllProducts);
    }  
}