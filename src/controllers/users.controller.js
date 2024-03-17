import CustomError from '../errors/Custom.Error.js';
import EErrors from '../errors/enums.js';
import {
    getUsers as GetUsersService,
    getUserById as getUserByIdService,
    changeUserRole as ChangeUserRoleService,
    deleteUser as DeleteUserService,
    cleanInactiveUsers as CleanInactiveUsersService,
    uploadDocuments as uploadDocumentsServices
} from '../services/users.services.js';
import Users from '../dao/dbManagers/user.managers.js';

const userDao = new Users();

// Controlador para obtener todos los usuarios
const GetUsers = async (req, res) => {
    try {
        const users = await GetUsersService();
        res.send({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para cambiar el rol de un usuario
const ChangeUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const userRole = req.user.role;
        if (userRole !== 'admin') {
            throw CustomError.createError({
                name: 'UserError',
                cause: 'Permission denied',
                message: 'You are not allowed to change user roles',
                code: EErrors.PERMISSION_DENIED
            });
        }
        const updatedUser = await ChangeUserRoleService(uid);
        res.send({ status: 'success', payload: updatedUser });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para renderizar la vista de edición de usuarios
const RenderEditUsers = async (req, res) => {
    try {
        const users = await userDao.get();
        res.render('editUsers', { users });
        console.log(req.user)
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para subir documentos del usuario
const uploadDocuments = async (req, res) => {
    try {
        const files = req.files
        const { id } = req.params
        const user = await getUserByIdService(id)

        const result = await uploadDocumentsServices(user, files)
        return res.sendSuccess(result)
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            req.logger.error(`${error.message}`)
            return res.sendNotFoundError(error.message)
        } else {
            req.logger.fatal(`${error.message}`)
            return res.sendServerError(error.message)
        }
    }
}


// Controlador para eliminar un usuario
const DeleteUser = async (req, res) => {
    try {
        const userId = req.params.uid
        const result = await DeleteUserService(userId);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
        req.logger.error(error.message);
    }
}

// Controlador para eliminar usuarios inactivos
const CleanInactiveUsers = async (req, res) => {
    try {
        await CleanInactiveUsersService();
        res.send({ status: 'success', message: 'Usuarios inactivos eliminados correctamente' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
        req.logger.error(error.message);
    }
}

export {
    GetUsers,
    ChangeUserRole,
    RenderEditUsers,
    DeleteUser,
    CleanInactiveUsers,
    uploadDocuments
}