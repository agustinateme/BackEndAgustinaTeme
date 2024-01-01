import Products from '../dao/mongo/products.mongo.js';

const productsManager = new Products();

const getProducts = async (page, limit, sort, query) => {
    const options = {
        page: page,
        limit: limit,
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const filter = query ? { category: query, status: true } : { status: true };
    const result = await productsManager.filterProducts(filter, options);
    
    return result;
}

const getProductById = async (id) => {
    const product = await productsManager.getProductById(id);
    return product;
}

const addProduct = async (product) => {
    const result = await productsManager.addProduct(product);
    return result;
}

const updateProduct = async (id, product) => {
    const result = await productsManager.updateProduct(id, product);
    return result;
}

const deleteProduct = async (id) => {
    const result = await productsManager.deleteProduct(id);
    return result;
}

export {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}