import CartsManager from "../dao/dbManagers/carts.managers.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductsManager from '../dao/dbManagers/products.managers.js';
import ProductRepository from "../repositories/products.repository.js";
import {ticketsModel} from '../dao/dbManagers/models/tickets.models.js';

const cartDao = new CartsManager();
const cartRepository = new CartRepository(cartDao);

const productDao = new ProductsManager();
const productRepository = new ProductRepository(productDao);

const processPurchase = async (cartId, user) => {
    const unavailableProducts = [];
    const availableProducts = [];
    const cart = await cartRepository.getCartById(cartId);

    for (const cartProduct of cart.products) {
        const productId = cartProduct.product;
        const productInfo = await productRepository.getProductById(productId);

        if (productInfo && productInfo.stock >= cartProduct.quantity) {
            // Verificar si hay suficiente stock disponible para el producto en el carrito
            await productRepository.updateProduct(productId, {
                stock: productInfo.stock - cartProduct.quantity,
            });

            // Preparar la información del producto disponible
            const productToAdd = {
                ...cartProduct.toObject(),
                price: productInfo.price,
            };

            availableProducts.push(productToAdd);
        } else {
            // Agregar productos no disponibles al arreglo correspondiente
            unavailableProducts.push(productId);
        }
    }

    // Función para generar el código de ticket
    const generateTicketCode = () => Date.now() + Math.floor(Math.random() * 100000 + 1);

    // Función para calcular el monto total de la compra
    const calculateTotalAmount = (products) => {
        return products.reduce((total, product) => {
            const price = product.price || 0;
            const quantity = Number(product.quantity) || 0;
            const productAmount = price * quantity;
            return total + productAmount;
        }, 0);
    };

    // Actualizar los productos en el carrito con los que están disponibles
    const updatedProducts = cart.products.filter(
        (product) => !availableProducts.some((pd) => pd.product === product.product || pd.product === undefined)
    );

    // Actualizar el carrito si hay productos disponibles
    if (availableProducts.length > 0) {
        await cartRepository.updateCart(cart._id, { products: updatedProducts });
    }

    // Calcular el total de la compra
    const totalAmount = calculateTotalAmount(availableProducts);

    // Generar ticket si hay productos disponibles
    if (availableProducts.length > 0) {
        const ticketData = {
            code: generateTicketCode(),
            amount: totalAmount,
            purchaser: user.email,
        };

        const ticket = await ticketsModel.create(ticketData);

        return { ticket };
    }

    return { unavailableProducts }; // Retornar productos no disponibles
};

export { processPurchase };


