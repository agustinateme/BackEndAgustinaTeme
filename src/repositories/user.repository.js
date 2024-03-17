import UsersDto from "../DTOs/user.dto.js";

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    //Devuelve un usuario por su email
    getByEmail = async (email) => {
        const user = await this.dao.getByEmail(email);
        return user;
    }

    //Crea un usuario
    save = async (user) => {
        const result = await this.dao.save(user)
        return result;
    }

    getUsers = async () => {
        let result = await this.dao.get()
        return result
    }

    getUserById = async (uid) => {
        let result = await this.dao.getById(uid)
        return result
    }

    updateUser = async (uid, user) => {
        let result = await this.dao.update(uid, user)
        return result
    }

    deleteById = async (uid) => {
        let result = await this.dao.deleteById(uid)
        return result
    }

    deleteAllUsers = async () => {
        let result = await this.dao.delete()
        return result
    }

    findInactiveUsers = async () => {
        const result = await this.dao.findInactiveUsers();
        return result;
    }

    uploadDocuments = async (user, documents) => {
        const result = await this.dao.uploadDocuments(user, documents)
        return result
    }
}
