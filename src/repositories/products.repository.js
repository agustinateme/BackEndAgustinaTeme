import { Products as ProductsDao } from "../dao/factory.js";

// Clase que representa el repositorio de productos
export default class ProductsRepository {
    constructor() {
        this.dao = new ProductsDao();
    }

    // Filtra los productos
    filterProducts = async (filter, options) => {
        const result = await this.dao.filterProducts(filter, options);
        return result;
    }

    // Obtiene todos los productos
    getProducts = async () => {
        const result = await this.dao.getAll();
        return result;
    }

    // Agrega un producto
    addProduct = async (product) => {
        const ProductToCreate = new ProductDto(product)
        const result = await this.dao.save(ProductToCreate);
        return result;
    }

    // Obtiene un producto por su id
    getProductById = async (productId) => {
        const cart = await this.dao.getById(productId);
        return cart;
    }

    // Actualiza un producto
    updateProduct = async (id, updatedFields) => {
        const result = await this.dao.update(id, updatedFields);
        return result;
    }

    // Elimina un producto por su id
    deleteProduct = async (productId) => {
        const result = await this.dao.delete(productId);
        return result;
    }

}

