import { ProductsModel } from './models/products.models.js';

export default class Products {
    constructor() {
        console.log('Products database operations are ready.');
    }

    //Obtiene todos los productos
    getProducts = async () => {
        const products = await ProductsModel.find();
        return products;
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
