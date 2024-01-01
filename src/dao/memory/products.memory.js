export default class Products {
    constructor() {
        this.data = [];
    }

    //Obtiene todos los productos
    getProducts = async () => {
        return this.data;
    };

    //Agrega un producto
    addProduct = async (product) => {
        const productAlreadyExists = this.products.some(
            (existingProduct) => existingProduct.code === product.code
        );
        if (productAlreadyExists) {
            throw new Error("Product with this code already exists");
        }

        this.products.push(product);
        return product;
    }

    //Obtiene un producto por su id
    getProductById = async (id) => {
        return this.data[{ _id: id }];
    };

    //Actualiza un producto
    updateProduct = async (pid, updatedFields) => {
        const index = this.products.findIndex((product) => product._id === pid);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            return this.products[index];
        }
    };

    //Elimina un producto
    deleteProduct = async (pid) => {
        const index = this.products.findIndex((product) => product._id === pid);
        if (index !== -1) {
            this.products.splice(index, 1);
            return { message: "Producto eliminado correctamente" };
        }
    };
    
}