import Users from '../dao/mongo/users.mongo.js';
import { createHash, generateToken, isValidPassword } from '../utils.js';

const usersManager = new Users();

const register = async (user) => {
    const { first_name, last_name, role, email, password } = user;

    if (!first_name || !last_name || !role || !email || !password) {
        return res.sendClientError('incomplete values')
    }

    const existsUser = await usersManager.getByEmail(email);

    if (existsUser) {
        return res.sendClientError('user already exists');
    }

    const hashedPassword = createHash(password);

    const newUser = {
        ...user
    }

    newUser.password = hashedPassword;

    const result = await usersManager.save(newUser);
    return result;
}

const login = async (user) => {
    const { email, password } = user;

    if (!email || !password) {
        return res.sendClientError('incomplete values')
    }

    const logUser = await usersManager.getByEmail(email);

    if (!logUser) {
        return res.sendClientError('incorrrect credentials')
    }

    const comparePassword = isValidPassword(password, logUser.password);

    if (!comparePassword) {
        return res.sendClientError('incorrrect credentials')
    }

    const accessToken = generateToken(user);

    return accessToken;
}

export {
    register,
    login
}
