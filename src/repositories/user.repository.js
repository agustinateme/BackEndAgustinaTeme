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
}