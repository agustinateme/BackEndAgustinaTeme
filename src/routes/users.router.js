import Router from './router.js';
import Users from '../dao/dbManagers/user.managers.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { register, login } from '../controllers/users.controller.js';

export default class UsersRouter extends Router {
    constructor() {
        super();
        this.usersManager = new Users();
    }

    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.login)
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.register)
    }
}