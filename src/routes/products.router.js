import { Router } from "express";
import ProductManager from '../managers/ProductManagers.js'
import { __dirname } from "../utils.js";
import path from 'node:path';

const router = Router();

const productsFilePath = path.join(__dirname, "./files/products.json");
const productManager = new ProductManager(productsFilePath);


router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    const cant = req.query.limit;

    //si en el path limit no se ingreso nada retorna todos los productos
    if (!cant) return res.send(products);

    //si en el path limit no se ingresó un número, retorna un mensaje de error
    if (isNaN(cant)) return res.status(404).send({ error: 'ingrese un numero' })

    //creo un objeto con la cantidad pasada en el path de elementos
    const filteredProducts = products.slice(0, cant);
    res.send(filteredProducts);
})

router.get('/:pid', async (req, res) => {
    const id = Number(req.params.pid);
    const product = await productManager.getProductById(id);
    if (!product) return res.status(404).send({ error: 'producto no encontrado' })

    res.send(product);
});

router.post('/', async (req, res) => {
    const product = req.body;
    await productManager.addProduct(product);

    res.send({ status: 'success', payload: product });
});

router.put('/:pid', async (req, res) => {
    const product = req.body;
    const id = Number(req.params.pid);
    await productManager.updateProduct(id, product);

    res.send({ status: 'success', payload: await productManager.getProductById(id) });
});

router.delete('/:pid', async (req, res) => {
    const id = Number(req.params.pid);
    await productManager.deleteProduct(id);

    res.send({ status: 'success'});
});

export default router;