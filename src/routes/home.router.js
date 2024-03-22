import Router from "express";
import { renderHomePage } from '../controllers/views.controller.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { handlePolicies } from "../middlewares/authJwt.js";
import { passportCall } from "../config/passport.config.js";

const router = Router();

//Renderiza los productos
router.get('/', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER]), renderHomePage);

export default router;