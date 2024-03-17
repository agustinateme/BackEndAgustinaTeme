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

    //Actualiza la ultima conección
    updateLastConnection = async (userId, lastConnection) => {
        return await usersModel.findByIdAndUpdate(userId, { last_connection: lastConnection });
    }

    //Elimina todos los usuarios
    deleteAllUsers = async () => {
        usersModel.deleteMany();
    } 

    //Encuentra usuarios inactivos
    findInactiveUsers = async () => {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        return await usersModel.find({ last_connection: { $lt: twoDaysAgo } }).lean();
    }

    //Actualiza los documentos de un usuario
    uploadDocuments = async (user, documents) => {
        const uid = user._id
        for (const doc of documents) {
            const existingDoc = await usersModel.findOne({
                _id: uid,
                "documents.name": doc.name
            })

            if (existingDoc) {
                await usersModel.updateOne(
                    { _id: uid, "documents.name": doc.name },
                    { $set: { "documents.$.reference": doc.reference } }
                )
            } else {
                await usersModel.updateOne(
                    { _id: uid },
                    { $addToSet: { documents: doc } }
                )
            }
        }

        const userUpdated = await usersModel.findById(uid).lean()
        return userUpdated
    }
} 