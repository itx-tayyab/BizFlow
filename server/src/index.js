import dotenv from 'dotenv'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config({
  path: ".env",
});

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoutes);
app.use("/onboard",onboardingRoutes);
app.use("/team",teamRoutes);
app.use("/product", productRoutes);
app.use("/customer", customerRoutes);
app.use("/order", orderRoutes);
app.use("/settings", settingRoutes);
app.use("/reports", reportRoutes);
app.use("/dashboard", dashboardRoutes);

// Server running
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app }
