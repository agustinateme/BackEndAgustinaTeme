import Router from "express";
import { renderHomePage } from '../controllers/views.controller.js';
const router = Router();

//Renderiza los productos
router.get('/', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER]), renderHomePage);

export default router;