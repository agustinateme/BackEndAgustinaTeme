import express from 'express';
import {ProductsModel} from '../dao/dbManagers/models/products.models.js';
import {CartsModel} from '../dao/dbManagers/models/carts.models.js';

const router = express.Router();

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
});


// Ruta para ver detalles de un producto
router.get('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await ProductsModel.findById(productId);

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


// Ruta para añadir productos al carrito PROBANDO...
router.post('/carts/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        const cart = await CartsModel.findOne({ _id: cartId, userId: req.session.user._id });
        if (!cart) {
            return res.status(404).send('Carrito no encontrado o no pertenece al usuario.');
        }
        // Encuentra el producto y añádelo al carrito
        const product = await ProductsModel.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado.');
        }

        // Añade el producto al carrito
        cart.products.push({ product: productId, quantity });
        await cart.save();

        res.status(200).send({ message: 'Producto añadido al carrito', cartId: cart._id });
    } catch (error) {
        res.status(500).send('Error al añadir el producto al carrito.');
    }
});


const publicAccess = (req, res, next) => {
    if (req.session?.user) return res.redirect('/');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session?.user) return res.redirect('/login');
    next();
}

router.get('/register', publicAccess, (req, res) => {
    res.render('register')
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login')
});

router.get('/', privateAccess, (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
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
