import Router from 'express';
import { renderDetails, renderHomePage, renderCart, Login, Register} from '../controllers/views.controller.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { passportCall } from '../config/passport.config.js';
import { handlePolicies } from '../middlewares/authJwt.js';

const router = Router();

// Visualizar registro
router.get('/register', passportCall(passportStrategiesEnum.NOTHING), handlePolicies([accessRolesEnum.PUBLIC]), Register);

// Visualizar Logueo
router.get('/login', passportCall(passportStrategiesEnum.NOTHING), handlePolicies([accessRolesEnum.PUBLIC]), Login);

// Visualizar todos los productos con su respectiva paginación
router.get('/products', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), renderHomePage);

// Visualizar descripcion completa del producto seleccionado
router.get('/products/:pid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), renderDetails);

// Lista todos los productos del carrito seleccionado
router.get('/carts/:cid', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER]), renderCart);

// Visualizar home
router.get('/', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), renderHomePage);


export default router;