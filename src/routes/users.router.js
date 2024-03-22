import Router from 'express';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { uploadDocuments, ChangeUserRole, GetUsers, RenderEditUsers, DeleteUser, CleanInactiveUsers } from '../controllers/users.controller.js';
import { handlePolicies } from "../middlewares/authJwt.js";
import { passportCall } from "../config/passport.config.js";
import { multerFields } from '../middlewares/multer.js';

const router = Router();

router.get('/', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), GetUsers);
router.put('/premium/:uid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.ADMIN]), ChangeUserRole);
router.delete('/:uid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.ADMIN]), DeleteUser);
router.post("/:uid/documents", passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), multerFields, uploadDocuments);
router.delete('/', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.ADMIN]), CleanInactiveUsers);
router.get('/:uid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), RenderEditUsers);

export default router;