import Router from './router.js';
import Products from '../dao/memoryManager/products.managers.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct, mockingProducts } from '../controllers/products.controller.js';

export default class ProductsRouter extends Router {
    constructor() {
        super();
        this.productsManager = new Products(); 
    }

    init() {
        //Lista todos los productos de la base de datos
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, getProducts);

        //Trae solo el producto con el id proporcionado
        this.get('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, getProductById);

        //Agrega un producto
        this.post('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, addProduct);

        //Toma un producto y lo atualiza por los campos enviados desde el body
        this.put('/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, updateProduct);

        //Elimina el producto con el id indicado
        this.delete(':/pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteProduct);
    
        //Mocking y manejo de errores
        this.get('/mockingproducts', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, mockingProducts)       
    }
}