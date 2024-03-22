import Router from "express";
import { passportCall } from "../config/passport.config.js";
import { handlePolicies } from '../middlewares/authJwt.js';
import { ShowUserInfo } from "../controllers/current.controller.js";
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';

const router = Router();

//Muestra la info de un usuario
router.get('/', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER]), ShowUserInfo);

export default router;