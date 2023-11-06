import { ProductsModel } from './models/products.models.js';

export default class Products {
    constructor() {
        console.log('Products database operations are ready.');
    }

    async getProducts() {
        const products = await ProductsModel.find();
        return products;
    }

    async addProduct(product) {
        const result = await ProductsModel.create(product);
        return result;
    }

    async getProductById(id) {
        const result = await ProductsModel.findById(id);
        return result;
    }

    async updateProduct(id, product) {
        const result = await ProductsModel.updateOne({ _id: id }, product, { new: true });
        return result;
    }

    async deleteProduct(id) {
        const result = await ProductsModel.deleteOne({ _id: id });
        return result;
    }
}
