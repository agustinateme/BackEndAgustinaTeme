import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { login, register, test, changeRole, uploadFields } from '../controllers/users.controller.js';
import * as authJwt from '../middlewares/authJwt.js';
import multerFields from '../middlewares/multer.js'

export default class UsersRouter extends Router {
    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, login)
        this.post('/test', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, test)
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register)
        this.put('/premium/:uid', authJwt.verifyToken, authJwt.isUserOrPremium, changeRole)
        this.post("/:uid/documents", multerFields, uploadFields)
    }
}