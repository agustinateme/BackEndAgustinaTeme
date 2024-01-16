import Router from "express";
import {Test_logger} from "../controllers/logger.controller.js"

const router = Router();

router.get('/', Test_logger);

export default router;