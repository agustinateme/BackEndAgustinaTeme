import { getProducts as getProductsService, getProductById as getProductByIdService, addProduct as addProductService, updateProduct as updateProductService, deleteProduct as deleteProductService } from '../services/products.services.js';
import { productsServices, usersServices } from '../repositories/';
import { generateProduct } from "../utils.js";
import jwt from 'jsonwebtoken';

const getProducts = async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        const result = await getProductsService(page, limit, sort, query);
        
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
        req.logger.error(error.message);
    }
}

const getProductById = async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await getProductByIdService(id);
        res.send({ status: 'success', payload: product });
    }
    catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
        req.logger.error(error.message);
    }
}

const addProduct = async (req, res) => {
    try {
        const product = req.body;
        const { title, description, price, thumbnail, code, stock, status, category, owner } = req.body;

        if (!title || !description || !price || !code || !stock || !status || !category) {
            return res.status(400).send({ status: 'error', message: 'incomplete values' });
        }

        if (owner) {
            const token = req.cookies["jwtCookie"];
            if (!token) return res.status(403).json({ status: "error", error: "token no provided." });
       
            const { uid } = jwt.verify(token, "coder55575");

            let resultUser = await usersServices.getUserById(uid);
            if (!resultUser) return res.status(400).json({ message: "User not found." });
            if (resultUser.email !== owner) return res.status(400).json({ message: "Owner doesnt exists." });

            // Validar que el usuario cuente con role premium
            if (resultUser.role === "premium") {
                owner = resultUser.email
            } else {
                owner = null
            }
        }

        const result = await addProductService(product);
        res.send({ status: 'success', payload: result });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
        req.logger.error(error.message);
    }
}

const updateProduct = async (req, res) => {
    try {

        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        const id = req.params.pid;
        
        if (!title || !description || !price || !code || !stock || !status || !category) {
            return res.status(400).send({ status: 'error', message: 'incomplete values' });
        }

        const product = { title, description, price, thumbnail, code, stock, status, category };

        const result = await updateProductService(id, product);

        res.send({ status: 'success', payload: result });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
        req.logger.error(error.message);
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.pid;
        const result = await deleteProductService(id);
        res.send({ status: 'success', payload: result });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
        req.logger.error(error.message);
    }
}

const mockingProducts = async (req, res) => {
    try {
        let products = [];

        for (let i = 0; i < 100; i++) {
            products.push(generateProduct());
        }

        res.send({ status: "success", counter: products.length, data: products});
    } catch (error) {
        res.status(400).send({ error: error.message });
        req.logger.error(error.message);
    }
}


export {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    mockingProducts
}