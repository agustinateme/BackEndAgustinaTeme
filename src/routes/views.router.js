import Router from 'express';
import { renderProducts, renderDetails, renderHomePage, renderCart, Login, Register} from '../controllers/views.controller.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';

const router = Router();

// Visualizar registro
router.get('/register', passportCall(passportStrategiesEnum.NOTHING), handlePolicies([accessRolesEnum.PUBLIC]), Register);

// Visualizar Logueo
router.get('/login', passportCall(passportStrategiesEnum.NOTHING), handlePolicies([accessRolesEnum.PUBLIC]), Login);

// Visualizar todos los productos con su respectiva paginación
router.get('/products', passportCall(passportStrategiesEnum.JWT), handlePoliciesViews([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), renderProducts);

// Visualizar descripcion completa del producto seleccionado
router.get('/products/:pid', passportCallViews(passportStrategiesEnum.JWT), handlePoliciesViews([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), renderDetails);

// Lista todos los productos del carrito seleccionado
router.get('/carts/:cid', [accessRolesEnum.USER], passportStrategiesEnum.NOTHING, renderCart);

// Visualizar home
router.get('/', passportCall(passportStrategiesEnum.JWT), handlePoliciesViews([accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN]), renderHomePage);

