export default class UserDto {
    constructor(user) {
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.email = user.email;
        this.role = user.role || 'user';
        this.cart = user.cart;
        this.age = user.age;
    }
}