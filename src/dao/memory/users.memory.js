import { v4 as uuidv4 } from "uuid";

export default class Users {
    constructor() {
        this.data = [];
    }

    create = async (user) => {
        cart._id = uuidv4();
        this.data.push(user);
        return user;
    };

    get = async () => {
        return this.data;
    };

    getUserById = async (userId) => {
        return this.data[{ userId }];
    };

    modify = async (userId, newData) => {
        const index = this.users.findIndex((user) => user._id === userId);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...newData };
            return this.users[index];
        }
    };
    
    delete = async (userId) => {
        const index = this.users.findIndex((user) => user._id === userId);
        if (index !== -1) {
            const deletedUser = this.users.splice(index, 1)[0];
            return deletedUser;
        }
    };
}