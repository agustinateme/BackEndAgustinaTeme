import { usersModel } from "./models/users.models.js";

export default class Users {
    constructor() {
        console.log('Working users with DB');
    }

    //Devuelve un usuario por su email
    getByEmail = async (email) => {
        const user = await usersModel.findOne({ email }).lean();
        return user;
    }

    //Crea un usuario
    save = async (user) => {
        const result = await usersModel.create(user);
        return result;
    }
} 