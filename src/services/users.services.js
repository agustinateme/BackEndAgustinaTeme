import UsersRepository from "../repositories/user.repository.js";
import Users from '../dao/dbManagers/user.managers.js';
import { InvalidCredentials, UserAlreadyExists } from "../utils/custom.exceptions.js";
import EErrors from "../errors/enums.js";
import UserRepository from "../repositories/user.repository.js";
import CustomError from "../errors/Custom.Error.js";

const usersDao = new Users();
const usersRepository = new UsersRepository(usersDao);

const getUsers = async () => {
    try {
        const users = usersRepository.getUsers();
        return users
    } catch (error) {
        throw CustomError.createError({
            name: 'Users not found',
            cause: 'Error dont found users',
            message: `Users not found: ${error.message}`,
            code: EErrors.USER_NOT_FOUND
        });
    }
}

const updateUser = async (uid, user) => {
    const updateuser = await usersRepository.updateUser(uid, user);
    return updateuser;
}

const updateLastConnection = async (userId, lastConnection) => {
    try {
        await usersDao.updateLastConnection(userId, lastConnection);
    } catch (error) {
        throw new CustomError({
            name: 'UpdateLastConnectionError',
            message: `Error updating user's last connection: ${error.message}`,
            code: EErrors.INTERNAL_SERVER_ERROR
        });
    }
}

const getByEmail = async (email) => {
    const user = await usersRepository.getByEmail(email);
    if (!user) {
        throw new InvalidCredentials('user not found');
    }
    return user;
}

const getUserById = async (id) => {
    const user = await usersRepository.getUserById(id);
    if (!user) {
        throw new InvalidCredentials('user not found');
    }
    return user;
}

const changeUserRole = async (id) => {
    try {
        const user = await UserRepository.getUserById(id);;
        if (!user) {
            throw CustomError.createError({
                name: 'UserError',
                cause: 'User not found',
                message: 'User not found with the provided ID',
                code: EErrors.USER_NOT_FOUND
            });
        }

        user.role = (user.role === 'user') ? 'premium' : 'user';

        await user.save();
        return user;
    } catch (error) {
        throw CustomError.createError({
            name: 'DatabaseError',
            cause: 'Error changing user role',
            message: `Error changing user role: ${error.message}`,
            code: EErrors.DATABASE_ERROR
        });
    }
}

const deleteUser = async (id) => {
    const result = await usersRepository.deleteById(id);
    return result;
}

const cleanInactiveUsers = async () => {
    try {
        const users = await usersRepository.findInactiveUsers();
        users.forEach(async (user) => {
            await usersRepository.deleteById(user._id);
        });
    } catch (error) {
        throw new CustomError({
            name: 'CleanInactiveUsersError',
            message: `Error cleaning inactive users: ${error.message}`,
            code: EErrors.INTERNAL_SERVER_ERROR
        });
    }
}

const uploadDocuments = async (user, files) => {
    let documents = []
    const fileArray = Object.entries(files)
    fileArray.map(([name, data]) => {
        documents.push({ name, reference: data[0].path })
    })
    const result = await usersRepository.uploadDocuments(user, documents)
    return result
}


export {
    getUsers,
    updateUser,
    updateLastConnection,
    getByEmail,
    changeUserRole,
    usersRepository,
    getUserById,
    deleteUser,
    cleanInactiveUsers,
    uploadDocuments
}