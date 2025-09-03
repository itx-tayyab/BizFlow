import dotenv from 'dotenv';
import { app } from './app.js';  
import pool from './db/db.js';

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 5001;

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
