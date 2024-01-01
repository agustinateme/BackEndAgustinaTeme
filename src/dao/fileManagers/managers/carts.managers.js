import fs from 'fs';

class CartManagerFS {
    constructor(path) {
        this.path = path;
    }

    //Devuelve todos los carritos
    getAll = async () => {
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

    //Crea un carrito
    addCart = async () => {
        try {
            const allCarts = await this.getAll();
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

    //Obtiene un carrito por su id
    getById = async (id) => {
        try {
            const allCarts = await this.getCart();
            const cartById = allCarts.find(p => p.id === id);

            if (!cartById) {
                throw new Error(`There is no cart with the ID = ${id} entered`);
            }
            return cartById;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //Actualiza los productos del carrito pasado por id
    updateCart = async (idCart, idProduct) => {
        try {
            const allCarts = await this.getCart();
            const cartIndex = allCarts.findIndex(p => p.id === idCart);

            if (cartIndex !== -1) {
                const productIndex = allCarts[cartIndex].products.findIndex(product => product.id === idProduct);

                if (productIndex !== -1) {
                    allCarts[cartIndex].products[productIndex].quantity++;
                } else {
                    allCarts[cartIndex].products.push({ id: idProduct, quantity: 1 });
                }

                await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, '\t'));
            } else { 
                throw new Error("The cart you are trying to update does not exist.");
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
}
export default CartManagerFS;