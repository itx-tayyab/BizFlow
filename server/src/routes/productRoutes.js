import express from 'express';
import { addCategory, addProduct, getCategories, getProducts } from '../controllers/productControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { categoryLimiter, addProductLimiter, getProductsLimiter, getCategoriesLimiter } from '../middlewares/ratelimitterMiddleware.js';

const router = express.Router();

router.post("/addcategory", authenticate, categoryLimiter, addCategory);
router.post("/addproduct", authenticate, addProductLimiter, addProduct);

router.get("/getproducts", authenticate, getProductsLimiter, getProducts);
router.get("/getcategories", authenticate, getCategoriesLimiter, getCategories);

//router.delete("/deleteproduct/:id", authenticate, deleteProduct);

export default router;