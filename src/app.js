import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.static("public"))
app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes);

export { app }