import { Router } from 'express';
import { Login, Logout, Register, MockUsers, Github, GitHubCallback } from '../controllers/sessions.controller.js';
import passport from 'passport';
import { handlePolicies } from "../middlewares/authJwt.js";
import { passportCall } from "../config/passport.config.js";
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';


const router = Router();

router.post('/register', passportCall(passportStrategiesEnum.NOTHING), handlePolicies([accessRolesEnum.PUBLIC]), Register);

router.post('/login', passportCall(passportStrategiesEnum.NOTHING), handlePolicies([accessRolesEnum.PUBLIC]), Login);

router.get('/logout', passportCall(passportStrategiesEnum.JWT), handlePolicies([accessRolesEnum.USER, accessRolesEnum.ADMIN]), Logout);

router.get('/github', passportCall(passportStrategiesEnum.GITHUB), handlePolicies([accessRolesEnum.PUBLIC]), passport.authenticate('github', { scope: ['user:email'] }), Github);

router.get('/github-callback', passportCall(passportStrategiesEnum.GITHUB), handlePolicies([accessRolesEnum.PUBLIC]), passport.authenticate('github', { failureRedirect: '/login' }), GitHubCallback);

router.get('/mockingproducts', MockUsers);

export default router;