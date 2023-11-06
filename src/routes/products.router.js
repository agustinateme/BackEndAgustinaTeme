import { Router } from "express";
import Products from '../dao/dbManagers/products.managers.js';
import { ProductsModel } from '../dao/dbManagers/models/products.models.js';

const router = Router();
const productManager = new Products();

router.get('/', async (req, res) => {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    const options = {
        page: page,
        limit: limit,
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const filter = query ? { category: query, status: true } : { status: true };

    try {
        const result = await ProductsModel.paginate(filter, options);
        res.send({
            status: 'success',
            payload: {
                docs: result.docs,
                totalPages: result.totalPages,
                prevPage: result.hasPrevPage ? result.prevPage : null,
                nextPage: result.hasNextPage ? result.nextPage : null,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
            }
        });
    } catch (error) {
        res.send({ status: 'error', payload: { message: error.message } });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await productManager.getProductById(id);
        res.send({ status: 'success', payload: product });
    }
    catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const product = req.body;
        await productManager.addProduct(product);
        res.send({ status: 'success', payload: product });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }

});

router.put('/:pid', async (req, res) => {
    try {

        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        if (!title || !description || !price || !code || !stock || !status || !category) {
            return res.status(400).send({ status: 'error', message: 'incomplete values' });
        }

        const product = { title, description, price, thumbnail, code, stock, status, category };

        const id = req.params.pid;

        await productManager.updateProduct(id, product);

        res.send({ status: 'success', payload: product });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;