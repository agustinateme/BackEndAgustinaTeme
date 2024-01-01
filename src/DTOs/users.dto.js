class UsersDto {
    constructor(user) {
        this.role = `${user.role}`;
        this.name = `${user.name} ${user.lastname}`;
        this.age = `${user.age}`;
        this.email = `${user.email}`;
        this.cart = `${user.cart}`;  
    }
}

export default UsersDto;