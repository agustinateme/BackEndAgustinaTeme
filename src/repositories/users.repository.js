import UsersDto from "../DTOs/users.dto.js";

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUsers = async () => {
        const result = await this.dao.get();
        return result;
    };

    createUser = async (user) => {
        const userToInsert = new UsersDto(user);
        const result = await this.dao.create(userToInsert);
        return result;
    };
}
