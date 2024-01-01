import { generateToken } from "../../utils.js";
import {usersModel} from "./models/users.models.js";
import bcrypt from "bcrypt";

export default class Users {
    async registerUser(name, email, password) {
        try {
            if (!name || !email || !password) {
                throw new Error("Informacion de usuario incompleta");
            }

            const existingUser = await usersModel.findOne({ email });
            if (existingUser) {
                throw new Error("Usuario ya existe");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new usersModel({ name, email, password: hashedPassword });
            await newUser.save();

            const accessToken = generateToken(newUser);
            return accessToken;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async loginUser(email, password) {
        try {
            if (!email || !password) {
                throw new Error("Ingrese Email y contraseña");
            }

            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("No existe usuario");
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new Error("Usuario y/o contraseña incorrecta");
            }

            const accessToken = generateToken(user);
            return accessToken;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async loginAdmin(email, password) {
        try {
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;

            if (email === adminEmail && password === adminPassword) {
                const user = await usersModel.findOne({ email });

                if (user) {
                    user.role = "ADMIN";
                    await user.save();
                }

                return true;
            } else {
                throw new Error("ADMIN not authentication");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}