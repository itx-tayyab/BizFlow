import express from 'express';
import { newOrder, getAllOrders, getOrderById, updateOrderStatus, recordPayment } from '../controllers/orderControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { newOrderLimiter, getAllOrdersLimiter, OrderDetailsLimiter, OrderUpdateLimiter } from '../middlewares/ratelimitterMiddleware.js';

const router = express.Router();

router.post("/neworder", authenticate, newOrderLimiter, newOrder);

router.get("/getallorders", authenticate, getAllOrdersLimiter, getAllOrders);
router.get("/:id", authenticate, OrderDetailsLimiter, getOrderById);
router.patch("/:id/status", authenticate, OrderUpdateLimiter, updateOrderStatus);
router.post("/recordpayment", authenticate, recordPayment);

export default router;