// UserDto: Representa la información del usuario, incluyendo nombre completo, correo electrónico, rol y carrito de compras.
export default class UserDto {
    constructor(user) {
        this.name = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.role = user.role || 'user';
        this.cart = user.cart;
        this.age = user.age;
    }
}