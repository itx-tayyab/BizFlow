import express from 'express';
import { profileInfo, businessInfo, updateBusinessInfo, updateProfileInfo } from '../controllers/settingControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { getSettingsLimiter, updateSettingsLimiter } from '../middlewares/ratelimitterMiddleware.js';

const router = express.Router();

router.get("/profileinfo", authenticate, getSettingsLimiter, profileInfo);

router.get("/businessinfo", authenticate, getSettingsLimiter, businessInfo);

router.put('/business', authenticate, upload.single('logo'),updateSettingsLimiter,updateBusinessInfo);

router.put('/profile', authenticate, upload.single('avatar'), updateSettingsLimiter, updateProfileInfo);


export default router;