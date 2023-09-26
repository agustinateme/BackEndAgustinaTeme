import fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    getCart = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const cart = JSON.parse(data);
                return cart;
            }
            else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    addCart = async () => {
        try {
            const allCarts = await this.getCart();
            let cart = {}
            //Estructura de un carrito
            cart.id = allCarts.length === 0 ? 1 : allCarts[allCarts.length - 1].id + 1;
            cart.products = [];
            
            //Agrego el carrito al array de carritos
            allCarts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, '\t'));
            return cart;

        } catch (error) {
            console.log(error);
        }
    }

    getCartById = async (id) => {
        try {
            const allCarts = await this.getCart();
            const cartById = allCarts.find(p => p.id === id);

            if (!cartById) {
                console.log("There is no cart with the ID entered");
                return;
            }
            return cartById;
        } catch (error) {
            console.log(error);
        }
    }

    updateCart = async (idCart, idProduct) => {
        try {
            //Busco el indice del carrito que me pasan
            const allCarts = await this.getCart();
            const cartIndex = allCarts.findIndex(p => p.id === idCart);

            // Si existe el carrito, busco el índice del producto dentro del carrito
            if (cartIndex !== -1) {
                const productIndex = allCarts[cartIndex].products.findIndex(product => product.id === idProduct);

                // Si el producto ya existe en el carrito, aumento la cantidad
                if (productIndex !== -1) {
                    allCarts[cartIndex].products[productIndex].quantity++;
                } else { // Si no existe, agrego el producto al carrito con cantidad 1
                    allCarts[cartIndex].products.push({ id: idProduct, quantity: 1 });
                }

                // Guardo los cambios en el archivo
                await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, '\t'));
            } else { // Si el carrito no existe, muestro un mensaje de error
                console.log("The cart you are trying to update does not exist. \nTry again");
            }

        } catch (error) {
            console.log(error);
        }
    }
}
export default CartManager;