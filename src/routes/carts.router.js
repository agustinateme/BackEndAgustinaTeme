import Router from './router.js';
import Carts from '../dao/dbManagers/carts.managers.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';

export default class CartsRouter extends Router {
    constructor() {
        super();
        this.cartManager = new Carts();
    }

    init() {
        this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.addCart);
        this.get('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getCartById);
        this.post('/:cid/product/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.addProduct);
        this.delete('/:cid/products/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteProduct);
        this.put('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.updateAllProducts);
        this.put('/:cid/products/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.updateQuantity);
        this.delete('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteAllProducts);
    }

    //Crea un carrito vacío
    async addCart (req, res) {
        try {
            const newCart = await cartManager.addCart();
            res.status(201).send({ status: 'success', payload: newCart });
        } catch (error) {
            res.status(500).send({ status: 'error', payload: error.message });
        }
    }

    //Obtiene todos los productos del carrito pasado
    async getCartById(req, res) {
        try {
            const cart = await cartManager.getById(req.params.cid).populate('products.product').exec();

            if (cart) {
                res.status(200).send({ status: 'success', payload: cart.products });
            } else {
                res.status(404).send({ status: 'error', payload: 'Cart not found' });
            }
        } catch (error) {
            res.status(500).send({ status: 'error', payload: error.message });
        }
    }

    //Agrega al carrito un producto, si ya existe en el carrito aumenta en 1 la cantidad
    async addProduct(req, res) {
        try {
            const idCart = req.params.cid;
            const idProd = req.params.pid;

            // Obtiene el carrito actual
            const cart = await cartManager.getCartById(idCart);
            if (!cart) {
                return res.status(404).send({ error: "Cart not found" });
            }

            // Busca el índice del producto en el carrito
            const productIndex = cart.products.findIndex(p => p.product.toString() === idProd);

            // Si no se encuentra el producto, lo añade al carrito
            if (productIndex === -1) {
                cart.products.push({ product: idProd, quantity: 1 });
            } else {
                // Si el producto ya está en el carrito, incrementa la cantidad
                cart.products[productIndex].quantity++;
            }

            // Actualiza el carrito con los nuevos productos
            const updatedCart = await cartManager.updateCart(idCart, cart.products);

            res.status(200).send({ status: 'success', payload: updatedCart });
        }
        catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    //Elimina el producto seleccionado del carrito elegido
    async deleteProduct(req, res) {
        try {
            const idCart = req.params.cid;
            const idProd = req.params.pid;

            const result = await cartManager.deleteProduct(idCart, idProd);

            res.status(200).send({ status: 'success', payload: result });
        }
        catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    //Actualiza un carrito con un arreglo de productos
    async updateAllProducts(req, res) {
        try {
            const idCart = req.params.cid;
            const newProducts = req.body.products;

            const updatedCart = await cartManager.updateCart(idCart, { products: newProducts });

            res.status(200).send({ status: 'success', payload: updatedCart });
        } catch (error) {
            res.status(400).send({ status: 'error', payload: error.message });
        }
    }

    //Actualiza la cantidad de ejemplares directamente en la base de datos
    async updateQuantity(req, res) {
        try {
            const idCart = req.params.cid;
            const idProduct = req.params.pid;
            const newQuantity = req.body.quantity;

            const updatedCart = await cartManager.updateProductQuantity(idCart, idProduct, newQuantity);

            res.status(200).send({ status: 'success', payload: updatedCart });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    //Elimina todos los productos del carrito seleccionado
    async deleteAllProducts(req, res) {
        try {
            const idCart = req.params.cid;
            const deletedCart = await cartManager.deleteAllProducts(idCart);
            res.status(200).send({ status: 'success', payload: deletedCart });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
}