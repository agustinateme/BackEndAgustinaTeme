// ProductDto: Representa la información de un producto, incluyendo título, descripción, precio, stock, estado, categoría, propietario e imagenes.
export default class ProductDto {
    constructor(product) {
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = product.price;
        this.stock = product.stock;
        this.status = product.status;
        this.category = product.category;
        this.owner = product.owner;
        this.thumbnail = product.thumbnail || [];
    }
}