import Router from './router.js';
import Products from '../dao/dbManagers/products.managers.js';
import Carts from '../dao/dbManagers/carts.managers.js';
import { renderProducts, renderDetails, renderCart, addToCart, Login, Register } from '../controllers/views.controller.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';

export default class ViewsRouter extends Router {
    constructor() {
        super();
        this.productsManager = new Products();
        this.cartsManager = new Carts();
    }

    init() {
        //Visualizar registro
        this.get('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, Register);

        //Visualizar Logueo
        this.get('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, Login);

        //Visualizar todos los productos con su respectiva paginación
        this.get('/products', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, renderProducts);

        //Visualizar descripcion completa del producto seleccionado
        this.get('/products/:productId', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, renderDetails);

        //Lista todos los productos del carrito seleccionado
        this.get('/carts/:cid', [accessRolesEnum.USER], passportStrategiesEnum.NOTHING, renderCart);

        //Añade un producto al carrito
        this.post('/carts/:cartId/products/:productId', [accessRolesEnum.USER], passportStrategiesEnum.NOTHING, addToCart);
    }
}