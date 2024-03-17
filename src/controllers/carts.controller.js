// Controladores para manipular las operaciones relacionadas con los carritos de compras.
import {
    addCart as addCartService,
    getCartById as getCartByIdService,
    addProduct as addProductService,
    deleteProduct as deleteProductService,
    deleteAllProducts as deleteAllProductsService,
    updateAllProducts as updateAllProductsService,
    updateQuantity as updateQuantityService
} from '../services/carts.services.js';

// Controlador para agregar un nuevo carrito de compras.
const addCart = async (req, res) => {
    try {
        const newCart = await addCartService({});
        res.status(201).send({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).send({ status: 'error', payload: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para obtener un carrito de compras por su ID.
const getCartById = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await getCartByIdService(cid);
        res.status(200).send({ status: 'success', payload: cart.products });

    } catch (error) {
        res.status(500).send({ status: 'error', payload: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para agregar un producto a un carrito de compras.
const addProduct = async (req, res) => {
    try {
        const idCart = req.params.cid;
        const idProd = req.params.pid;

        const result = addProductService(idCart, idProd);
        res.status(200).send({ status: 'success', payload: result });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para eliminar un producto de un carrito de compras.
const deleteProduct = async (req, res) => {
    try {
        const idCart = req.params.cid;
        const idProd = req.params.pid;

        const result = await deleteProductService(idCart, idProd);

        res.status(200).send({ status: 'success', payload: result });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para eliminar todos los productos de un carrito de compras.
const deleteAllProducts = async (req, res) => {
    try {
        const idCart = req.params.cid;
        const deletedProducts = await deleteAllProductsService(idCart);

        res.status(200).send({ status: 'success', payload: deletedProducts });
    } catch (error) {
        res.status(400).send({ error: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para actualizar todos los productos de un carrito de compras.
const updateAllProducts = async (req, res) => {
    try {
        const idCart = req.params.cid;
        const newProducts = req.body.products;
        const updatedCart = await updateAllProductsService(idCart, newProducts);

        res.status(200).send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(400).send({ status: 'error', payload: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para actualizar la cantidad de un producto en un carrito de compras.
const updateQuantity = async (req, res) => {
    try {
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await updateQuantityService(idCart, idProduct, newQuantity);

        res.status(200).send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(400).send({ error: error.message });
        req.logger.error(error.message);
    }
}

export {
    addCart,
    getCartById,
    addProduct,
    deleteProduct,
    deleteAllProducts,
    updateAllProducts,
    updateQuantity,
}