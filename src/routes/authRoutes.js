import express from 'express';
import {registeruser,loginuser, logoutuser, refreshtoken} from '../controllers/authControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register", registeruser);
router.post("/login", loginuser);

router.post("/logout", authenticate, logoutuser);
router.post("/refreshtoken", refreshtoken);

router.post("/authenticate", authenticate, (req, res) => {
  // If token is valid, this will run
  res.json({
    message: "Token is valid ✅",
    user: req.user
  });});

export default router;