import express from 'express';
import { addCategory, addProduct, getProducts } from '../controllers/productControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { categoryLimiter, addProductLimiter, getProductsLimiter } from '../middlewares/ratelimitterMiddleware.js';

const router = express.Router();

router.post("/addcategory", authenticate, categoryLimiter, addCategory);
router.post("/addproduct", authenticate, addProductLimiter, addProduct);

router.get("/getproducts", authenticate, getProductsLimiter, getProducts);

export default router;