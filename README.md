# SpaceFlow: ระบบบริหารและจองพื้นที่อัจฉริยะ (Campus Space Booking System)
โครงงานปลายภาครายวิชา 4123307 การพัฒนาเว็บแอปพลิเคชัน (Lab 15 Final Project)

## ผู้พัฒนา
- **ชื่อ-นามสกุล:** นายธนพัฒน์ ป้อมเย็น
- **รหัสนักศึกษา:** 68042380112
- **สาขาวิชา:** วิทยาการคอมพิวเตอร์

## เทคโนโลยีที่ใช้ (Tech Stack)
- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Web Audio API, Vitest
- **Backend:** Node.js, Express.js, REST API, CORS, Dotenv
- **Database:** MySQL (`mysql2/promise`)

## ขั้นตอนการติดตั้งและรันระบบ (Installation Guide)
1. **การเตรียมฐานข้อมูล (MySQL):**
   - เปิดโปรแกรม XAMPP และกด Start ที่ Apache และ MySQL
   - เปิด `http://localhost/phpmyadmin` สร้างฐานข้อมูลชื่อ `campus_space_booking`
   - นำเข้า (Import) หรือรันคำสั่งจากไฟล์ `database/schema.sql`

2. **การรันฝั่ง Backend:**
   ```bash
   cd backend
   npm install
   npm run dev