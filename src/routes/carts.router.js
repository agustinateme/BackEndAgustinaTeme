import { Router } from "express";
import CartManager from '../managers/CartManagers.js'
import { __dirname } from "../utils.js";
import path from 'node:path';

const router = Router();

const productsFilePath = path.join(__dirname, "./files/carts.json");
const cartManager = new CartManager(productsFilePath);

router.post('/', async (req, res) => {
    await cartManager.addCart();
    res.send({ status: 'success'});
});

router.get('/:cid', async (req, res) => {
    const id = Number(req.params.cid);
    const products = await cartManager.getCartById(id).products;

    res.send({ status: 'success', payload: products });
});

router.post('/:cid/product/:pid', async (req, res) => {
    const idCart = Number(req.params.cid);
    const idProduct = Number(req.params.pid);
    await cartManager.updateCart(idCart, idProduct);

    res.send({ status: 'success'});
});

export default router;