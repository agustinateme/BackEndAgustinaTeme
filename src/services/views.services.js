import { ProductsModel } from '../dao/dbManagers/models/products.models.js'


const renderHomePage = async (limit, page, query, sort, user) => {

    const result = await ProductsModel.paginate(query, { limit, page, sort });
    const cartId = user.cart;
    const products = result.docs.map(doc => doc.toObject());

    return { products, cartId, result }
}

export {
    renderHomePage
}