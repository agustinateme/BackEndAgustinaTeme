import Router from './router.js';
import Products from '../dao/memoryManager/products.managers.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct} from '../controllers/products.controller.js';

export default class ProductsRouter extends Router {
    constructor() {
        super();
        this.productsManager = new Products; 
    }

    init() {
        this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getProducts);
        this.get('/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.getProductById);
        this.post('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.addProduct);
        this.put('/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.updateProduct);
    }
}