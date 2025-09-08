import express from 'express';
import {registeruser} from '../controllers/authControllers.js'

const router = express.Router();

router.post("/register", registeruser);
//router.post("/login", loginuser);

export default router;