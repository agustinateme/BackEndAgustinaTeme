import { renderHomePage as renderHomepageService } from '../services/views.services.js';
import { getProductById as getProductByIdService } from '../services/products.services.js';
import { getCartById as getCartByIdService } from '../services/carts.services.js';

// Controlador para renderizar la página de registro
const Register = async (req, res) => {
    res.render('register')
}

// Controlador para renderizar la página de inicio de sesión
const Login = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

// Controlador para renderizar la página de inicio con productos
const renderHomePage = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const query = req.query.query ? JSON.parse(req.query.query) : {};
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort ? JSON.parse(req.query.sort) : {};

        const user = req.user;

        const { products, cartId, result } = await renderHomepageService(limit, page, query, sort, user);
        res.render('products', { products, cartId, total: result.total, limit, page, user: req.user });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para renderizar los detalles de un producto
const renderDetails = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await getProductByIdService(productId);
        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado.' });
        }

        // Convertir el documento de Mongoose a un objeto JavaScript plano
        const productObject = product.toObject();

        // Renderizar la vista de detalles del producto con la información del producto
        res.render('productDetails', { product: productObject });
    } catch (error) {
        res.status(500).render('error', { message: 'Error al recuperar los detalles del producto.' });
        req.logger.error(error.message);
    }
}

// Controlador para renderizar el carrito de compras
const renderCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await getCartByIdService(cartId).populate('products.product');

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
        req.logger.error(error.message);
    }
}

export {
    renderHomePage,
    renderDetails,
    renderCart,
    Register,
    Login
}