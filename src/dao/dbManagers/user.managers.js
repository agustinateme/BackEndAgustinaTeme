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

    //Obtiene todos los usuarios con la información completa de su carrito
    get = async () => {
        const result = await usersModel.find().populate('cart');
        return result;
    }
       
    //Obtiene un usuario por su ID con la información completa de su carrito
    getById = async (uid) => {
        const result = await usersModel.findOne({ _id: uid }).populate('cart').lean()
        return result;
    }

    //Crea un usuario
    save = async (user) => {
        const result = await usersModel.create(user);
        return result;
    }

    //Elimina todos los usuarios
    deleteAllUsers = async () => {
        usersModel.deleteMany();
    } 
} 