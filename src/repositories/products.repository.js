import ProductDto from "../DTOs/product.dto.js"

export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    //Obtiene todos los productos
    getProducts = async () => {
        const carts = await this.dao.getAll();
        return carts;
    }

    //Agrega un producto
    addProduct = async (product) => {
        const ProductToCreate = new ProductDto(product)
        const result = await this.dao.save(ProductToCreate);
        return result;
    }

    //Obtiene un producto por su id
    getProductById = async (productId) => {
        const cart = await this.dao.getById(productId);
        return cart;
    }

    //Actualiza un producto
    updateProduct = async (id, updatedFields) => {
        const result = await this.dao.update(id, updatedFields);
        return result;
    }

    //Elimina un producto
    deleteProduct = async (productId) => {
        const result = await this.dao.delete(productId);
        return result;
    }

}

