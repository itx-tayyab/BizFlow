import express from 'express';
import { BusinessOnboarding } from '../controllers/onboardingControllers.js';

const router = express.Router();

router.post("/onboarding", BusinessOnboarding);

export default router;