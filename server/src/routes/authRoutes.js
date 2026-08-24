import express from 'express';
import {registeruser, loginuser, logoutuser} from '../controllers/authControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { loginLimiter, registerLimiter } from '../middlewares/ratelimitterMiddleware.js';

const router = express.Router();

router.post("/register", registerLimiter, registeruser);

router.post("/login", loginLimiter, loginuser);

router.post("/logout", authenticate, logoutuser);
// router.post("/refreshtoken", refreshtoken);


export default router;