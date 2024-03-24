import { CartsModel } from '../dao/dbManagers/models/carts.models.js';
import Users from '../dao/dbManagers/user.managers.js';
import UserRepository from "../repositories/user.repository.js";
import { usersModel } from '../dao/dbManagers/models/users.models.js';
import { fakerES as faker } from '@faker-js/faker';
import { isValidPassword, createHash, generateToken } from '../utils.js';

const userDao = new Users();
const userRepository = new UserRepository(userDao)

const Register = async (first_name, last_name, age, role, email, password) => {
    const user = await userRepository.getByEmail(email);

    if (!user) {
        const cart = await CartsModel.create({ products: [] });
        const userToSave = new usersModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role,
            cart: cart._id
        });

        await userToSave.save();
        return userToSave;
    }

}

const Login = async (email, password) => {
    const user = await userRepository.getByEmail(email);
    if (user || isValidPassword(password, user.password)) {
        const { password: _, ...userResult } = user;
        const accessToken = generateToken(userResult);
        return accessToken;
    }
}

const generateUsers = () => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(['user', 'admin']),
        cart: faker.database.mongodbObjectId(),
        age: faker.number.int({ min: 10, max: 100 }),
        id: faker.database.mongodbObjectId()
    }
}

export {
    Register,
    Login,
    generateUsers
}