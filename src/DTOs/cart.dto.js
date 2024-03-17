// CartDto: Representa el contenido de un carrito de compras, con una lista de productos y sus cantidades.
export default class CartDto {
    constructor(cart) {
        this.products = cart.products.map(productEntry => ({
            product: productEntry.product._id,
            quantity: productEntry.quantity || 1
        }));
    }
}