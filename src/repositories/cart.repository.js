import CartDto from "../DTOs/cart.dto.js"

export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    //Devuelve todos los carritos
    getAll = async () => {
        const result = await this.dao.getAll();
        return result;
    }

    //Crea un carrito
    addCart = async (cart) => {
        const cartToCreate = new CartDto(cart);
        const result = await this.dao.create(cartToCreate);
        return result;
    }

    //Obtiene un carrito por su id
    getById = async (cartId) => {
        const cart = await this.dao.getById(cartId);
        return cart;
    }

    //Actualiza los productos del carrito pasado por id
    updateCart = async (cartId, products) => {
        const result = await this.dao.update(cartId, products);
        return result;
    }

    //Actualiza la cantidad del producto seleccionado del carrito elegido
    updateProductQuantity = async (cartId, productId, newQuantity) => {
        const result = await this.dao.update(cartId, productId, newQuantity);
        return result;
    }

    //Elimina el carrito pasado por id
    deleteCart = async (cartId) => {
        const result = this.dao.delete(cartId)
        return result;
    }
}