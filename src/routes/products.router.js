import { Router } from 'express';
import {Products} from '../dao/factory.js';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct} from '../controllers/products.controller.js';

const router = Router();
const productsDao = new Products();

router.get('/', async (req, res) => {
    const data = await productsDao.getProducts();
    res.json(data);
});

router.post('/', async (req, res) => {
    const { title, description, price, category, stock, quantity } = req.body;
    const data = await productsDao.addProduct({
        title,
        description,
        price,
        category,
        stock,
        quantity,
    });
    res.json(data);
});

router.get('/:pid', getProductById);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct)

export default router;
