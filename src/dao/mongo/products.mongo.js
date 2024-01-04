import { ProductsModel } from '../mongo/models/products.models.js';

export default class Products {
    constructor() {
        console.log('Products database operations are ready.');
    }

    //Devuelve paginate filtrado por opciones
    filterProducts = async (filter, options) => {
        const result = await ProductsModel.paginate(filter, options);
        return result;
    }

    //Obtiene todos los productos
    getProducts = async () => {
        const products = await ProductsModel.find();
        return products;
    }

    //Verifica si un producto existe
    existProduct = async (prodId) => {
        const product = await ProductsModel.findById(prodId);
        return !!product;
    }

    //Verifica si un producto está en stock 
    //PRE: El producto existe
    isInStock = async (prodId) => {
        const product = await ProductsModel.findById(prodId);
        if (product.stock === 0) return false;
        return true;
    }

    //Agrega un producto
    addProduct = async (product) => {
        const result = await ProductsModel.create(product);
        return result;
    }

    //Obtiene un producto por su id
    getProductById = async (id) => {
        const result = await ProductsModel.findById(id);
        return result;
    }

    //Actualiza un producto
    updateProduct = async (id, product) => {
        const result = await ProductsModel.updateOne({ _id: id }, product, { new: true });
        return result;
    }

    //Elimina un producto
    deleteProduct = async (id) => {
        const result = await ProductsModel.deleteOne({ _id: id });
        return result;
    }
}
