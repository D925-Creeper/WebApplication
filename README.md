# 🚀 SpaceFlow - Smart Campus Studio & Space Booking
โครงงานพัฒนาเว็บแอปพลิเคชันด้วย React (Lab 15: Final Project)

## ผู้จัดทำ
- **ชื่อ - สกุล:** นายธนพัฒน์ ป้อมเย็น
- **รหัสนักศึกษา:** 68042380112
- **สาขาวิชา:** วิทยาการคอมพิวเตอร์

## จุดเด่นของระบบ (เกรด A+)
1. **Modern Dark UI:** ดีไซน์สไตล์ SaaS ระดับโมเดิร์น พร้อมรูปภาพสตูดิโอจริงและเอฟเฟกต์ Glassmorphism
2. **Demo Role Switcher:** คลิกเดียวสลับบทบาทระหว่าง "นักศึกษา (ธนพัฒน์)" และ "ผู้ดูแลระบบ (Admin)" ได้ทันที
3. **Conflict Prevention (409):** ระบบป้องกันการจองห้องเดียวกันในวันและเวลาเดียวกันซ้ำอย่างแม่นยำ
4. **Approval Lifecycle:** คำขอเริ่มต้นที่สถานะ `pending` แอดมินสามารถกดอนุมัติ (`approved`) หรือปฏิเสธ (`rejected`) ได้แบบเรียลไทม์
5. **Room Management:** แอดมินสามารถสั่งเปิด-ปิดปรับปรุงห้อง (Maintenance) ได้ทันที

## วิธีการรันระบบ
```bash
# 1. ฝั่ง Backend (Port 3000)
cd backend
npm install
npm run dev

# 2. ฝั่ง Frontend (Port 5173) - เปิด Terminal ใหม่อีกจอ
cd frontend
npm install
npm run dev
```
