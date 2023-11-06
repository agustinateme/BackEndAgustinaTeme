import express from 'express';
import {ProductsModel} from '../dao/dbManagers/models/products.models.js';
import {CartsModel} from '../dao/dbManagers/models/carts.models.js';

const router = express.Router();

// Ruta para mostrar los productos con paginación
router.get('/products', async (req, res) => {
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

        res.render('products', {
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
});


// Ruta para mostrar un carrito específico con sus productos
router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartsModel.findById(cartId).populate('products.product');

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
});

/*
router.get('/products-view', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('products', { products });
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/carts-view', async (req, res) => {
    try {
        const carts = await cartManager.getCart();
        res.render('carts', { carts });
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        style: 'index.css'
    });
});

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', {
            style: 'index.css',
            products
        });
    } catch (error) {
        res.status(500).send('Error al cargar los productos');
    }
});
*/
export default router;