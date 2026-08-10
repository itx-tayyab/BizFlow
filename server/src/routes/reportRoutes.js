import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { ReportsLimiter } from '../middlewares/ratelimitterMiddleware.js';
import { getFinancialOverview, getInventoryInsights, getStaffPerformance, getCustomerInsights } from '../controllers/reportControllers.js';

const router = express.Router();

router.get("/financial", authenticate, ReportsLimiter, getFinancialOverview);
router.get("/inventory", authenticate, ReportsLimiter, getInventoryInsights);
router.get("/staff", authenticate, ReportsLimiter, getStaffPerformance);
router.get("/customers", authenticate, ReportsLimiter, getCustomerInsights);

export default router;