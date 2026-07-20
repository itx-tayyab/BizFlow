import express from 'express';
import { newCustomer, CustomerDetails, CustomerRisk, getallCustomers, getCustomerById } from '../controllers/customerControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { newCustomerLimiter, CustomerDetailsLimiter, CustomerRiskLimiter, GetAllCustomerLimiter } from '../middlewares/ratelimitterMiddleware.js';

const router = express.Router();

router.post("/newcustomer", authenticate, newCustomerLimiter, newCustomer);

router.put("/customerdetails/:id", authenticate, CustomerDetailsLimiter, CustomerDetails);

router.patch("/customerrisk/:id", authenticate, CustomerRiskLimiter, CustomerRisk);

router.get("/getallcustomers", authenticate, GetAllCustomerLimiter, getallCustomers);

router.get("/:id", authenticate, CustomerDetailsLimiter, getCustomerById);

export default router;