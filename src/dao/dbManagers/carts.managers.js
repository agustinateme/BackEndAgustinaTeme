import { CartsModel } from './models/carts.models.js';

export default class Carts {
    constructor() {
        console.log('Carts database operations are ready.');
    }

    async getCarts() {
        const result = await CartsModel.find().lean();
        return result;
    }

    async addCart() {
        const result = await CartsModel.create({});
        return result;
    }

    getCartById(id) {
        return CartsModel.findById(id);
    }

    async deleteProduct(cid, pid) {
        const result = await CartsModel.updateOne(
            { _id: cid },
            { $pull: { products: { product: pid } } }
        );
        return result;
    }

    async updateCartWithProducts(cartId, productsToUpdate) {
        // Encuentra el carrito y actualízalo con el nuevo arreglo de productos
        const updatedCart = await CartsModel.findByIdAndUpdate(
            cartId,
            { $set: { products: productsToUpdate } },
            { new: true, runValidators: true }
        );

        return updatedCart;
    }

    async updateCart(id, products) {
        // Esta operación encuentra un carrito por ID y actualiza sus productos.
        const updatedCart = await CartsModel.findOneAndUpdate(
            { _id: id },
            { $set: { products: products } },
            { new: true, runValidators: true }
        );

        if (!updatedCart) {
            throw new Error("The cart was not found or no update was made.");
        }

        return updatedCart;
    }

    async deleteCart(id) {
        const cart = await CartsModel.findById(id);
        if (!cart) {
            throw new Error("The cart you are trying to delete does not exist.");
        }
        const result = await CartsModel.deleteOne({ _id: id });
        return result;
    }
}
