import { MessagesModel } from './models/messages.models.js';

export default class Messages {
    constructor() {
        console.log('Messages database operations are ready.');
    }

    //Obtiene todos los mansajes
    getAllMessages = async () => {
        const allMessages = await messagesModel.find();
        return allMessages;
    }

    //Agrega un mensaje del usuario pasado
    addMessages = async (userId, messageContent) => {
        const newMessage = new MessagesModel({
            user: userId,
            message: messageContent
        });

        const savedMessage = await newMessage.save();
        return savedMessage;
    }

    //Obtiene todos los mensajes del usuario pasado
    getMessagesByUser = async (userId) => {
        const userMessages = await MessagesModel.find({ user: userId });
        return userMessages
    }

    //Elimina todos los mensajes del usuario pasado
    deleteMessagesByUser = async (userId) => {
        const delectionResult = await MessagesModel.deleteMany({ user: userId });
        return delectionResult;
    }

    //Elimina todos los mensajes de la coleccion
    deleteAllMessages = async () => {
        const delectionResult = await MessagesModel.deleteMany({});
        return delectionResult;
    }
}
