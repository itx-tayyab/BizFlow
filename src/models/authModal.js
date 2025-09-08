import pool from '../db/db.js';


export const ExistingUser = async(email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
}

export const CreateNewUser = async(name, email, hashPassword) => {
    const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hashPassword]
  );
  return result.rows[0];
}

