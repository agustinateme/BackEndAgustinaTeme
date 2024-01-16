import { ProductsModel } from '../dao/dbManagers/models/products.models.js';
import Products from '../dao/dbManagers/products.managers.js';
import Carts from '../dao/dbManagers/carts.managers.js';

const products = new Products();
const carts = new Carts();

const Register = async (req, res) => {
    res.render('register')
}

const Login = async (req, res) => {
    res.render('login')
}

//ver los productos
const renderProducts = async (req, res) => {
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
        req.logger.error(error.message);
    }
}

//ver detalles de un producto
const renderDetails = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await products.getProductById(productId);
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

//Ruta para mostrar un carrito específico con sus productos
const renderCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await carts.getById(cartId).populate('products.product');

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

//Ruta para añadir productos al carrito
const addToCart = async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        const cart = await carts.getById(cartId);

        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        const product = await products.getProductById(productId);

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex === -1) {
            await carts.updateCart(cartId, product);
        }
        else {
            await carts.updateProductQuantity(cartId, productId, quantity);
        }

        res.status(200).send({ message: 'Producto añadido al carrito', cartId: cart._id });

    } catch (error) {
        res.status(500).send('Error al añadir el producto al carrito.');
        req.logger.error(error.message);
    }
}

export {
    renderDetails,
    renderProducts,
    renderCart,
    addToCart,
    Register,
    Login
}