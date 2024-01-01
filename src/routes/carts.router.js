import { Router } from 'express';
import {Carts} from '../dao/factory.js';
import { getCartById, addProduct, deleteProduct, deleteAllProducts, updateAllProducts, updateQuantity } from '../controllers/carts.controller.js';

const router = Router();
const cartsDao = new Carts();

router.post('/', async (req, res) => {
    const cart = [];
    const data = await cartsDao.addCart(cart);
    res.json(data);
})

router.get('/', async (req, res) => {
    const data = await cartsDao.getCartById();
    res.json(data);
})

router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProduct);
router.delete('/:cid/products/:pid', deleteProduct);
router.put('/:cid', updateAllProducts);
router.put('/:cid/products/:pid', updateQuantity);
router.delete('/:cid', deleteAllProducts);

export default router;