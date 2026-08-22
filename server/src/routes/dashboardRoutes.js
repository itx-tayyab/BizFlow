import express from 'express';
import { getDashboardData } from '../controllers/dashboardControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboarddata', authenticate, getDashboardData);

export default router;
