import * as usersService from '../services/users.services.js';
import { InvalidCredentials, UserAlreadyExists } from "../utils/custom.exceptions.js";

const register = async (req, res) => {
    try {
        const { first_name, last_name, role, email, password } = req.body;

        if (!first_name || !last_name || !role || !email || !password) {
            return res.sendClientError('incomplete values')
        }

        const result = await usersService.register({ ...req.body })

        res.sendSuccessNewResourse(result);
    } catch (error) {
        req.logger.error(error.message);

        if (error instanceof UserAlreadyExists) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendClientError('incomplete values')
        }

        const accessToken = await usersService.login(password, email);

        res.sendSuccess(accessToken);
    } catch (error) {
        req.logger.error(error.message);

        if (error instanceof InvalidCredentials) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const test = async (req, res) => {
    console.log("test")
    res.sendSuccess(accessToken);
}

const changeRole = async (req, res) => {
    try {
        let { uid } = req.params
        let user = await usersService.getUserById(uid)
        if (!user) return res.send({ message: "Unregistered user" })

         if (user.role === "user") {

            if (user.documents.length === 5) {
                user.role = "premium"
            } else {
                return res.status(400).json({ message: "You have not finished processing your documentation." })
            }

        } else {
            user.role = "user"
        }

        await usersService.updateUser(user._id, user)

        res.status(200).json({ message: "Role was changed successfully." })

    } catch (error) {
        res.status(400).json({ message: "Error when changing roles." })
    }
}

const uploadFields = async (req, res) => {
    try {
        let { uid } = req.params
        let user = await usersServices.getUserById(uid)
        if (!user) return res.send({ message: "Unregistered user" })
        if (!req.files) return res.send({ message: "Files not found." })

        user.documents.push({
            name: req.files['imagenPerfil'][0].originalname,
            reference: req.files['imagenPerfil'][0].path,
            status: "Ok"
        }, {
            name: req.files['imagenProducto'][0].originalname,
            reference: req.files['imagenProducto'][0].path,
            status: "Ok"
        })

        for (let i = 0; i < req.files['documents'].length; i++) {
            let document = {
                name: req.files['documents'][i].originalname,
                reference: req.files['documents'][i].path,
                status: "Ok"
            }
            user.documents.push(document)
        }

        if (user.documents.length === 5) user.role = "premium"
        await usersService.updateUser(uid, user)

        res.status(200).json({ message: "Archivos subidos correctamente. Su nivel de usuario se actualizó a premium." })

    } catch (error) {
        res.status(400).json({ message: "Error al subir archivos" })
    }
}

export {
    login,
    register,
    test,
    changeRole,
    uploadFields
}