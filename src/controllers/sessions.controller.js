import CustomError from '../errors/Custom.Error.js';
import EErrors from '../errors/enums.js';
import {
    Register as RegisterService,
    Login as LoginService, 
    generateUsers as generateUsersService
} from "../services/sessions.services.js";
import { updateLastConnection } from '../services/users.services.js'

// Controlador para iniciar sesión de usuario
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw CustomError.createError({
                name: 'UserError',
                cause: 'Invalid data types,email and password required',
                message: 'Error trying to loge in',
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        const accessToken = await LoginService(email, password)
        res.cookie('coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ status: 'success', message: 'login success' })
    } catch (error) {
        res.status(500).send({ error: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para cerrar sesión de usuario
const Logout = async (req, res) => {
    try {
        const userId = req.user._id;
        const lastConnection = new Date();
        await updateLastConnection(userId, lastConnection);
        req.session.destroy(error => {
            if (error) return res.status(500).send({ status: 'error', message: error.message });
            res.redirect('/login');
        })
    } catch (error) {
        console.log(req.user)
        res.status(500).send({ status: 'error trying to logout', message: error.message });
    }
}

// Controlador para registrar un nuevo usuario
const Register = async (req, res) => {
    try {
        const { first_name, last_name, age, role, email, password } = req.body;
        if (!first_name || !last_name || !age || !role || !email || !password) {
            throw CustomError.createError({
                name: 'UserError',
                cause: 'Invalid data types, first_name, last_name and email required',
                message: 'Error trying to create user',
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        const userToSave = await RegisterService(first_name, last_name, age, role, email, password)

        res.status(201).send({ status: 'success', payload: userToSave });
    } catch (error) {
        res.status(500).send({ error: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para generar usuarios de prueba
const MockUsers = async (req, res) => {
    let users = [];

    for (let i = 0; i < 100; i++) {
        users.push(generateUsersService());
    }

    res.send({
        data: users
    });
}

// Controlador para manejar la autenticación de GitHub
const Github = async (req, res) => {
    res.send({ status: 'success', message: 'user registered' });
}

// Controlador para manejar el callback de autenticación de GitHub
const GitHubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/Products');
}

export {
    Login,
    Logout,
    Register,
    MockUsers,
    Github,
    GitHubCallback
}