CREATE DATABASE IF NOT EXISTS campus_space_booking 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE campus_space_booking;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. ตารางข้อมูลห้องและสตูดิโอ (rooms)
CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'Studio',
  capacity INT NOT NULL,
  building VARCHAR(255) NOT NULL,
  floor VARCHAR(100) DEFAULT 'ชั้น 2',
  status ENUM('active', 'maintenance') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ตารางข้อมูลการจองพื้นที่ (bookings)
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  student_id VARCHAR(50) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  purpose TEXT NOT NULL,
  attendees_count INT DEFAULT 2,
  extra_items TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_notes VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- 3. ข้อมูลห้องมาตรฐาน 5 ห้อง (ตรงกับ Frontend App.jsx 100%)
INSERT INTO rooms (id, name, category, capacity, building, floor, status) VALUES
(1, 'Studio 101: สตูดิโอบันทึกเสียง & พอดแคสต์ระดับโปร', 'Studio', 6, 'อาคาร 4 คณะวิทยาศาสตร์', 'ชั้น 2 (ห้อง 4201)', 'active'),
(2, 'Co-Meeting Lounge A: ห้องประชุมและระดมความคิดอัจฉริยะ', 'Meeting', 12, 'อาคารวิทยบริการและเทคโนโลยี', 'ชั้น 3 (โซน Innovation)', 'active'),
(3, 'Esports & Live Streaming Arena: ห้องซ้อมแข่งขันเกมอีสปอร์ต', 'Esports', 8, 'ศูนย์คอมพิวเตอร์และสารสนเทศ', 'ชั้น 4 (Cyber Space)', 'active'),
(4, 'Focus Pod B2: ตู้ทำงานและสัมภาษณ์เก็บเสียงส่วนบุคคล', 'Focus Pod', 2, 'หอสมุดกลางเฉลิมพระเกียรติ', 'ชั้น 1 (Silent Zone)', 'maintenance'),
(5, 'Creative Workshop Room: ห้องปฏิบัติการออกแบบและสร้างโมเดล', 'Workshop', 16, 'อาคารเฉลิมพระเกียรติ 50 พรรษา', 'ชั้น 5 (Design Hub)', 'active');

-- 4. ข้อมูลการจองเริ่มต้น (ใช้วันที่ปัจจุบัน CURDATE() เพื่อให้แสดงบนตารางสัปดาห์ทันที)
INSERT INTO bookings (room_id, student_id, student_name, date, time_slot, purpose, attendees_count, extra_items, status, admin_notes) VALUES
(1, '68042380112', 'ธนพัฒน์ ป้อมเย็น', CURDATE(), '10:30 - 12:30', 'บันทึกเสียงและคลิปสาธิตโครงงาน Web Application Lab 15 Final', 3, '["ไมโครโฟน Shure SM7B x4","ขาตั้งกล้อง Heavy Duty"]', 'approved', 'อนุมัติเรียบร้อย ติดต่อรับกุญแจที่เคาน์เตอร์ชั้น 2'),
(3, '68042380199', 'สมศรี ใจมั่น', CURDATE(), '13:00 - 15:00', 'ฝึกซ้อมการแข่งขัน Valorant Campus Tournament รอบคัดเลือก', 5, '["เว็บแคม Elgato Facecam Pro"]', 'pending', ''),
(2, '68042380112', 'ธนพัฒน์ ป้อมเย็น', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:00 - 17:00', 'ประชุมจัดทำเอกสารและสไลด์นำเสนอโครงงานวิชา 4123307', 4, '["รีโมท Presentation Clicker"]', 'approved', 'อนุมัติแล้ว กรุณาดูแลความสะอาดหลังใช้งาน'),
(5, '68042380105', 'กิตติศักดิ์ เจริญพร', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:30 - 10:30', 'ประกอบชิ้นงานต้นแบบ IoT Smart Campus', 6, '["ชุดหัวแร้งบัดกรีปรับอุณหภูมิได้"]', 'pending', '');
