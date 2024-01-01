import { CartsModel } from '../mongo/models/carts.models.js';

export default class Carts {
    constructor() {
        console.log('Carts database operations are ready.');
    }

    //Devuelve todos los carritos
    getAll = async () => {
        const carts = await CartsModel.find().lean();
        return carts;
    }

    //Crea un carrito
    addCart = async (cart) => {
        const result = await CartsModel.create(cart);
        return result;
    }

    //Obtiene un carrito por su id
    getById = async (id) => {
        const cart = await CartsModel.findById(id);
        return cart;
    }

    //Actualiza los productos del carrito pasado por id
    updateCart = async (id, product) => {
        const result = await CartsModel.updateOne({ _id: id }, product);
        return result;
    }

    //Actualiza la cantidad del producto seleccionado del carrito elegido
    updateProductQuantity = async (cartId, productId, newQuantity) => {
        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex === -1) {
                throw new Error('Product not found in cart');
            }

            cart.products[productIndex].quantity = newQuantity;
            const result = await cart.save();
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    //Elimina el carrito pasado por id
    deleteCart = async (id) => {
        const cart = await CartsModel.findByIdAndDelete(id);
        return cart;
    }

    //Elimina un producto seleccionado del carrito seleccionado
    deleteProduct = async (cid, pid) => {
        const result = await CartsModel.updateOne(
            { _id: cid },
            { $pull: { products: { product: pid } } }
        );
        return result;
    }

    // Elimina todos los productos del carrito
    deleteAllProducts = async (cartId) => {    
        const cart = await CartsModel.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = [];
        const result = await cart.save();
        return result;
    }

    //Verifica si un carrito existe
    existCart = async (cartId) => {
        const cart = await CartsModel.findById(cartId);
        return !!cart;
    }
}
