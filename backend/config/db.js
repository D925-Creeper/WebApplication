import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_space_booking',
  port: Number(process.env.DB_PORT) || 3306,
  dateStrings: true, // บังคับให้ส่งค่า DATE เป็น YYYY-MM-DD ตรงกับ Frontend
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
