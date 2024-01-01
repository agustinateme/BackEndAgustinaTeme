import Carts from '../dao/mongo/carts.mongo.js';
import Products from '../dao/mongo/products.mongo.js';

const cartsManager = new Carts();
const productsManager = new Products();

const addCart = async (cart) => {
    const result = cartsManager.addCart(cart);
    return result;
}

const getCartById = async (cid) => {
    const cart = await cartsManager.getById(cid).populate('products.product').exec();
    if (!cart) throw new Error('Cart not found.');
    return cart;
}

//Agrega un producto existente a un carrito existente solo si el producto está en stock
const addProduct = async (idCart, idProd) => {
    const cart = await cartsManager.getById(idCart);
   
    if (!cart) throw new Error('Cart not found.'); 
    if (await productsManager.existProduct(idProd) === false) throw new Error('Product not found.'); 
    if (await productsManager.isInStock(idProd) === false) throw new Error('Product whitout stock');

    const productIndex = cart.products.findIndex(p => p.product.toString() === idProd);

    if (productIndex === -1) {
        cart.products.push({ product: idProd, quantity: 1 });
    } else {
        cart.products[productIndex].quantity++;
    }

    const updateCart = await cartsManager.updateCart(idCart, cart.products);
    return updateCart;
}

const deleteProduct = async (idCart, idProd) => {
    if (await cartsManager.existCart(idCart) === false) throw new Error('Cart not found.'); 
    const result = await cartsManager.deleteProduct(idCart, idProd);
    return result;
}

const deleteAllProducts = async (idCart) => {
    if (await cartsManager.existCart(idCart) === false) throw new Error('Cart not found.'); 
    const deleteProducts = await cartsManager.deleteAllProducts(idCart);
    return deleteProducts;
}

const updateAllProducts = async (idCart, newProducts) => {
    if (await cartsManager.existCart(idCart) === false) throw new Error('Cart not found.'); 
    const updatedCart = await cartsManager.updateCart(idCart, { products: newProducts });
    return updatedCart;
}

const updateQuantity = async (idCart, idProduct, newQuantity) => {
    const updatedCart = await cartsManager.updateProductQuantity(idCart, idProduct, newQuantity);
    return updatedCart;
}

const purchase = async (cid, user) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    let amount = 0;

    const outStock = [];

    cart.products.forEach(async ({ product, quantity }) => {
        if (product.stock >= quantity) {
            amount += product.price * quantity;
            product.stock -= quantity;
            await productsReposity.updateById('Id del producto', product)
        } else {
            outStock.push({ product, quantity });
        }
    });

    const ticket = await ticketsService.generatePurchase(user, amount);
    await cartsRepository.updateProducts(cid, outStock);

    await session.commitTransaction();

    await session.abortTransaction();
    session.endSession();
}

export {
    addCart,
    getCartById,
    addProduct,
    deleteProduct,
    deleteAllProducts,
    updateAllProducts,
    updateQuantity,
    purchase
}