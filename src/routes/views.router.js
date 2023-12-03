import Router from './router.js';
import Products from '../dao/dbManagers/products.managers.js';
import Carts from '../dao/dbManagers/carts.managers.js';
import { ProductsModel } from '../dao/dbManagers/models/products.models.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';

export default class ViewsRouter extends Router {
    constructor() {
        super();
        this.productsManager = new Products();
        this.cartsManager = new Carts();
    }

    init() {
        this.get('/products', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.renderProducts);
        this.get('/products/:productId', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.renderDetails);
        this.get('/carts/:cid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.renderCart);
        this.post('/carts/:cartId/products/:productId', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.addToCart);
    }

    //Ruta para ver los productos
    async renderProducts(req, res) {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        try {
            const options = {
                page: page,
                limit: limit,
                lean: true,
                leanWithId: false
            };

            const result = await ProductsModel.paginate({}, options);

            console.log("Datos de usuario:", req.session.user);

            res.render('products', {
                user: req.session.user,
                products: result.docs,
                page: result.page,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                limit: result.limit
            });
        } catch (error) {
            res.status(500).render('error', { message: 'Error al cargar la lista de productos.' });
        }
    }


    //Ruta para ver detalles de un producto
    async renderDetails(req, res) {
        try {
            const productId = req.params.productId;
            const product = await Products.getProductById(productId);

            if (!product) {
                return res.status(404).render('error', { message: 'Producto no encontrado.' });
            }

            // Convertir el documento de Mongoose a un objeto JavaScript plano
            const productObject = product.toObject();

            // Renderizar la vista de detalles del producto con la información del producto
            res.render('productDetails', { product: productObject });
        } catch (error) {
            res.status(500).render('error', { message: 'Error al recuperar los detalles del producto.' });
        }
    }

    //Ruta para mostrar un carrito específico con sus productos
    async renderCart(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await Carts.getById(cartId).populate('products.product');

            if (!cart) {
                return res.status(404).render('error', { message: 'Carrito no encontrado.' });
            }

            // Calcular el subtotal de cada producto y añadirlo al objeto de producto
            const productsWithSubtotals = cart.products.map(item => {
                return {
                    ...item.toObject(), // Convierte el subdocumento de Mongoose a un objeto simple
                    subtotal: item.quantity * item.product.price // Calcula el subtotal
                };
            });

            // Renderizar la plantilla 'cart' con los productos y sus subtotales
            res.render('carts', { products: productsWithSubtotals });
        } catch (error) {
            res.status(500).render('error', { message: 'Error al cargar el carrito.' });
        }
    }

    //Ruta para añadir productos al carrito
    async addToCart(req, res) {
        try {
            const { cartId, productId } = req.params;
            const { quantity } = req.body;

            const cart = await Carts.getById(cartId);

            if (!cart) {
                return res.status(404).send('Cart not found');
            }

            const product = await Products.getProductById(productId);

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex === -1) {
                await updateCart(cartId, product);
            }
            else {
                await updateProductQuantity(cartId, productId, quantity);
            }

            res.status(200).send({ message: 'Producto añadido al carrito', cartId: cart._id });

        } catch (error) {
            res.status(500).send('Error al añadir el producto al carrito.');
        }
    }
}