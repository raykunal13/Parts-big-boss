import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

console.log({
    "Connection string":process.env.DB_STRING
})

export const pool = new Pool({
    connectionString: process.env.DB_STRING,
});

export async function dbconnect() {
    try {
        await pool.connect();
        console.log("Connected to the database successfully.");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}
