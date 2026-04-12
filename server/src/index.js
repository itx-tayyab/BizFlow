import dotenv from 'dotenv';
import { app } from './app.js';  
import pool from './db/db.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 5001;

dotenv.config({
  path: "./.env",
});

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.static("public"))
app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoutes);

// Server running
app.listen(port, async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("DB Connected. Current time:", result.rows[0]);
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
  console.log(`Server is running on port ${port}`);
});

export { app }
