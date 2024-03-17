import Router from "express";
import { resetPassword, sendEmail, sendPassword } from "../controllers/resetPassword.controller.js";

const router = Router();

router.post('/', resetPassword);
router.get('/Newpass', sendPassword);
router.get('/SendEmailReset', sendEmail);

export default router;