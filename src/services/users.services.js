import UsersRepository from "../repositories/user.repository.js";
import { Users } from '../dao/factory.js';
import { InvalidCredentials, UserAlreadyExists } from "../utils/custom.exceptions.js";
import { loginInvalidCredentials } from "../utils/custom.html.js";
import { sendEmail } from "./mail.service.js";
import { createHash, generateToken, isValidPassword } from "../utils/utils.js";

const usersDao = new Users();
const usersRepository = new UsersRepository(usersDao);

const updateUser = async (uid, user) => {
    const user = await usersRepository.updateUser(uid, user);
    return user;
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

const login = async (password, email) => {
    const user = await usersRepository.getByEmail(email);

    if (!user) {
        throw new InvalidCredentials('incorrect credentials');
    }

    const comparePassword = isValidPassword(password, user.password);

    if (!comparePassword) {
        const emailInvalidCredentials = {
            to: user.email,
            subject: 'Login fallido',
            html: loginInvalidCredentials
        };

        await sendEmail(emailInvalidCredentials);

        throw new InvalidCredentials('incorrect credentials');
    }

    const accessToken = generateToken(user);

    return accessToken;
}

const register = async (user) => {
    const userByEmail = await usersRepository.getByEmail(user.email);

    if (userByEmail) {
        throw new UserAlreadyExists('user already exists')
    }

    const hashedPassword = createHash(user.password);

    const newUser = {
        ...user
    }

    newUser.password = hashedPassword;

    const result = await usersRepository.save(newUser);

    return result;
}

export {
    getByEmail,
    login,
    register,
    usersRepository,
    getUserById,
    updateUser
}