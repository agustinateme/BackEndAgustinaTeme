import { Router } from "express";
import {ProductsModel} from "../dao/mongo/models/products.models.js";
import Products from "../dao/mongo/products.mongo.js";
import Chat from "../dao/mongo/chat.mongo.js";
import Carts from "../dao/mongo/carts.mongo.js";

const router = Router();

const productManager = new Products();
const cartManager = new Carts();
const chatManager = new Chat();
    

const publicAccess = (req, res, next) => {
    if (req.session?.user) return res.redirect("/home");
    next();
};
const privateAccess = (req, res, next) => {
    if (!req.session?.user) return res.redirect("/login");
    next();
};

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
})

router.get('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productManager.getProductById(productId);

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
})

router.get('/carts/:cartId/products/:productId', async (req, res) => { 
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        const cart = await cartManager.getById(cartId);

        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        const product = await productManager.getProductById(productId);

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
})

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getById(cartId).populate('products.product');

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

router.get("/", (req, res) => {
    if (req.session?.user) {
        res.redirect("/home");
    } else {
        res.redirect("/login");
    }
});

router.get("/register", publicAccess, (req, res) => {
    res.render("register");
});

router.get("/login", publicAccess, (req, res) => {
    res.render("login");
});


router.get("/profile", privateAccess, (req, res) => {
    const user = req.session.user;
    res.render("profile", { user });
});

router.get("/chat", async (req, res) => {
    const messages = await chatManager.getAll();
    res.render("chat", { messages });
});


router.get("/carts/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        res.render("cart", { cart });
    } catch (error) {
        console.error(error.message);
    }
});

export default router;