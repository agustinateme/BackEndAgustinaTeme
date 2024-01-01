import { v4 as uuidv4 } from "uuid";

export default class Carts {
    constructor() {
        this.data = [];
    }

    //Devuelve todos los carritos
    getAll = async () => {
        return this.data;
    };

    //Crea un carrito
    addCart = async (cart) => {
        cart._id = uuidv4();
        this.data.push(cart);
        return cart;
    };

    //Obtiene un carrito por su id
    getById = async (id) => {
        return this.data[{ _id: id }];
    };

    //Actualiza los productos del carrito pasado por id
    updateCart(cid, products) {
        this.carts[cid].products = products;
        return this.carts[cid];
    }

    //Actualiza la cantidad del producto seleccionado del carrito elegido
    updateProductQuantity = async (pid, cart, newQuantity) => {
        const index = this.data.findIndex((cId) => cId._id === id);
        this.carts[index].products[pid].quantity = newQuantity;
        return cart;
    };

    //Elimina el carrito pasado por id
    deleteCart = async (id) => {
        const index = this.data.findIndex((cId) => cId._id === id);
        this.data.splice(index, 1);
        return { id };
    };

    //Elimina un producto seleccionado del carrito seleccionado
    deleteProduct(cid, pid) {
        const cart = this.carts[cid];
        cart.products = cart.products.filter((product) => product.product !== pid);
        return cart;
    }

    // Elimina todos los productos del carrito
    deleteAllProducts(cid) {
        this.carts[cid].products = [];
        return this.carts[cid];
    }
}