const fs = require('fs');
const path = require('path');

console.log('🚀 กำลังติดตั้งโครงงาน SpaceFlow - Smart Campus Studio & Space Booking (Ultra-Modern Edition)...');

function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 สร้างโฟลเดอร์: ${dirPath}`);
  }
}

function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  createDir(dir);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`📄 สร้างไฟล์: ${filePath}`);
}

createDir('backend/config');
createDir('backend/controllers');
createDir('backend/routes');
createDir('frontend/src/components');
createDir('database');
createDir('docs');

createFile('database/schema.sql', `
-- สร้างฐานข้อมูล SpaceFlow (รองรับระบบจองพื้นที่ มหาวิทยาลัย)
CREATE DATABASE IF NOT EXISTS campus_space_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_space_booking;

-- ตารางห้องและพื้นที่
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  building VARCHAR(100) NOT NULL,
  floor VARCHAR(50) NOT NULL,
  amenities VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  status ENUM('active', 'maintenance') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางการจอง
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  student_id VARCHAR(50) NOT NULL,
  student_name VARCHAR(150) NOT NULL,
  booking_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  purpose TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- ข้อมูลตัวอย่างสำหรับสาธิต
INSERT INTO rooms (name, category, capacity, building, floor, amenities, image_url, status) VALUES
('Creative Co-Working Lounge', 'Co-Working', 12, 'อาคารวิทยบริการ', 'ชั้น 2', 'Wi-Fi 6, จอ 4K 65 นิ้ว, ไวท์บอร์ด, ปลั๊ก Type-C', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80', 'active'),
('Esports & Game Streaming Studio', 'Esports', 6, 'ศูนย์คอมพิวเตอร์', 'ชั้น 3', 'PC Gaming Spec สูง, จอ 240Hz, ไฟสตูดิโอ, ไมค์คอนเดนเซอร์', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80', 'active'),
('Podcast & Music Studio A', 'Studio', 4, 'อาคาร 4 คณะวิทยาศาสตร์', 'ชั้น 1', 'ไมโครโฟน Shure, Sound Card, แผ่นซับเสียง, หูฟังมอนิเตอร์', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80', 'active'),
('Smart Meeting & Workshop Room', 'Meeting', 8, 'อาคาร 10', 'ชั้น 4', 'ระบบ Video Conference, Smart TV, กระดานกระจก', 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80', 'active'),
('Silent Focus Pod B1', 'Focus Pod', 1, 'หอสมุดกลาง', 'ชั้น 2', 'เก้าอี้ Ergonomic, โคมไฟอ่านหนังสือ, ช่องเสียบชาร์จด่วน', 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=900&q=80', 'maintenance');
`);

createFile('backend/package.json', `{
  "name": "spaceflow-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mysql2": "^3.9.7"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}`);

createFile('backend/.env', `PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=campus_space_booking
DB_PORT=3306
`);

createFile('backend/server.js', `
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-Memory Data Store พร้อม Seed Data ระดับโปร (รองรับการรันทันทีโดยไม่ต้องเปิด MySQL)
let rooms = [
  {
    id: 1,
    name: "Creative Co-Working Lounge",
    category: "Co-Working",
    capacity: 12,
    building: "อาคารวิทยบริการ",
    floor: "ชั้น 2",
    amenities: "Wi-Fi 6, จอ 4K 65 นิ้ว, ไวท์บอร์ด, ปลั๊ก Type-C",
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    status: "active"
  },
  {
    id: 2,
    name: "Esports & Game Streaming Studio",
    category: "Esports",
    capacity: 6,
    building: "ศูนย์คอมพิวเตอร์",
    floor: "ชั้น 3",
    amenities: "PC Gaming Spec สูง, จอ 240Hz, ไฟสตูดิโอ, ไมค์คอนเดนเซอร์",
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    status: "active"
  },
  {
    id: 3,
    name: "Podcast & Music Studio A",
    category: "Studio",
    capacity: 4,
    building: "อาคาร 4 คณะวิทยาศาสตร์",
    floor: "ชั้น 1",
    amenities: "ไมโครโฟน Shure, Sound Card, แผ่นซับเสียง, หูฟังมอนิเตอร์",
    image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80",
    status: "active"
  },
  {
    id: 4,
    name: "Smart Meeting & Workshop Room",
    category: "Meeting",
    capacity: 8,
    building: "อาคาร 10",
    floor: "ชั้น 4",
    amenities: "ระบบ Video Conference, Smart TV, กระดานกระจก",
    image_url: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80",
    status: "active"
  },
  {
    id: 5,
    name: "Silent Focus Pod B1",
    category: "Focus Pod",
    capacity: 1,
    building: "หอสมุดกลาง",
    floor: "ชั้น 2",
    amenities: "เก้าอี้ Ergonomic, โคมไฟอ่านหนังสือ, ช่องเสียบชาร์จด่วน",
    image_url: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=900&q=80",
    status: "maintenance"
  }
];

let bookings = [
  {
    id: 101,
    room_id: 1,
    room_name: "Creative Co-Working Lounge",
    student_id: "68042380112",
    student_name: "ธนพัฒน์ ป้อมเย็น",
    booking_date: "2026-10-10",
    time_slot: "09:00 - 12:00",
    purpose: "ทำโครงงาน Web Application พัฒนาเว็บไฟนอล Lab 15",
    status: "approved",
    admin_notes: "อนุมัติเรียบร้อย กรุณาลงชื่อใช้งานที่เคาน์เตอร์ชั้น 2",
    created_at: "2026-10-06T10:00:00.000Z"
  },
  {
    id: 102,
    room_id: 2,
    room_name: "Esports & Game Streaming Studio",
    student_id: "68042380199",
    student_name: "สมศรี ใจมั่น",
    booking_date: "2026-10-10",
    time_slot: "13:00 - 16:00",
    purpose: "ฝึกซ้อมการแข่งขันและบันทึกวิดีโอแคสต์เกมของชมรม",
    status: "pending",
    admin_notes: null,
    created_at: "2026-10-06T11:30:00.000Z"
  }
];

// 1. STATS API: สถิติสรุปบน Dashboard
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    totalRooms: rooms.length,
    activeRooms: rooms.filter(r => r.status === 'active').length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    approvedBookings: bookings.filter(b => b.status === 'approved').length
  });
});

// 2. ROOMS API: รายการห้องทั้งหมด
app.get('/api/rooms', (req, res) => {
  res.json({ success: true, data: rooms });
});

// 3. ROOMS API: สลับสถานะเปิดให้บริการ / ปิดปรับปรุง (Admin Only)
app.put('/api/rooms/:id/toggle-status', (req, res) => {
  const room = rooms.find(r => r.id === parseInt(req.params.id));
  if (!room) return res.status(404).json({ success: false, message: 'ไม่พบห้องที่ระบุ' });
  room.status = room.status === 'active' ? 'maintenance' : 'active';
  res.json({ success: true, message: \`อัปเดตสถานะห้องเป็น "\${room.status === 'active' ? 'พร้อมใช้งาน' : 'ปิดปรับปรุง'}" สำเร็จ\`, data: room });
});

// 4. BOOKINGS API: อ่านรายการจอง (รองรับตัวกรองบทบาท)
app.get('/api/bookings', (req, res) => {
  const { student_id, role, status } = req.query;
  let results = [...bookings];

  if (role === 'student' && student_id) {
    results = results.filter(b => b.student_id === student_id);
  }

  if (status && status !== 'all') {
    results = results.filter(b => b.status === status);
  }

  res.json({ success: true, data: results });
});

// 5. BOOKINGS API: สร้างคำขอจอง พร้อมระบบตรวจการจองชนกัน (Conflict Prevention 409)
app.post('/api/bookings', (req, res) => {
  const { room_id, student_id, student_name, booking_date, time_slot, purpose } = req.body;

  if (!room_id || !student_id || !student_name || !booking_date || !time_slot) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลการจองให้ครบถ้วนทุกช่อง' });
  }

  const room = rooms.find(r => r.id === parseInt(room_id));
  if (!room) return res.status(404).json({ success: false, message: 'ไม่พบห้องที่ต้องการจอง' });

  if (room.status === 'maintenance') {
    return res.status(400).json({ success: false, message: 'ห้องนี้ปิดปรับปรุงอยู่ชั่วคราว ไม่สามารถส่งคำขอจองได้' });
  }

  // ป้องกันการจองห้องเดียวกันในวันและเวลาเดียวกันซ้ำ!
  const hasConflict = bookings.some(b => 
    b.room_id === parseInt(room_id) &&
    b.booking_date === booking_date &&
    b.time_slot === time_slot &&
    b.status !== 'rejected'
  );

  if (hasConflict) {
    return res.status(409).json({ 
      success: false, 
      message: \`ขออภัย ห้อง "\${room.name}" ในช่วงเวลา \${time_slot} ของวันที่ \${booking_date} มีผู้จองแล้ว กรุณาเลือกช่วงเวลาอื่น\`
    });
  }

  const newBooking = {
    id: Date.now(),
    room_id: parseInt(room_id),
    room_name: room.name,
    student_id,
    student_name,
    booking_date,
    time_slot,
    purpose: purpose || 'การใช้งานเพื่อการศึกษาค้นคว้า',
    status: 'pending',
    admin_notes: null,
    created_at: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  res.status(201).json({ success: true, message: 'ส่งคำขอจองสำเร็จแล้ว! กรุณารอการตรวจสอบและอนุมัติ', data: newBooking });
});

// 6. BOOKINGS API: อนุมัติ หรือ ปฏิเสธคำขอจอง (Admin Action)
app.put('/api/bookings/:id/status', (req, res) => {
  const { status, admin_notes } = req.body;
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) return res.status(404).json({ success: false, message: 'ไม่พบรายการจองนี้' });

  if (status) booking.status = status;
  if (admin_notes) booking.admin_notes = admin_notes;

  res.json({ success: true, message: \`อัปเดตสถานะการจองเป็น "\${status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}" สำเร็จ\`, data: booking });
});

// 7. BOOKINGS API: ลบรายการจอง
app.delete('/api/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  bookings = bookings.filter(b => b.id !== bookingId);
  res.json({ success: true, message: 'ลบรายการจองเรียบร้อยแล้ว' });
});

app.listen(PORT, () => {
  console.log(\`✅ SpaceFlow API พร้อมทำงานที่ http://localhost:\${PORT}\`);
});
`);

createFile('frontend/package.json', `{
  "name": "spaceflow-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "lucide-react": "^0.378.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^15.0.5",
    "@vitejs/plugin-react": "^4.2.1",
    "jsdom": "^24.0.0",
    "vite": "^5.2.11",
    "vitest": "^1.6.0"
  }
}`);

createFile('frontend/.env', `VITE_API_URL=http://localhost:3000/api\n`);
createFile('frontend/.env.production', `VITE_API_URL=http://localhost:3000/api\n`);

createFile('frontend/vite.config.js', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true
  }
});
`);

createFile('frontend/src/setupTests.js', `import '@testing-library/jest-dom';\n`);

createFile('frontend/index.html', `<!DOCTYPE html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SpaceFlow - Smart Campus Studio & Space Booking</title>
    <!-- Google Fonts & Tailwind CDN เพื่อความสวยงามทันที -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Prompt', 'Plus Jakarta Sans', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <style>
      body { font-family: 'Prompt', sans-serif; }
    </style>
  </head>
  <body class="bg-[#0b0f19] text-slate-100 antialiased min-h-screen selection:bg-indigo-500 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

createFile('frontend/src/main.jsx', `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

createFile('frontend/src/components/StatusBadge.jsx', `import React from 'react';

export default function StatusBadge({ status, isDark = false }) {
  const configs = isDark ? {
    approved: { label: 'อนุมัติแล้ว', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    pending: { label: 'รอการอนุมัติ', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    rejected: { label: 'ปฏิเสธคำขอ', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
    active: { label: 'พร้อมใช้งาน', bg: 'bg-teal-500/15 text-teal-400 border-teal-500/30' },
    maintenance: { label: 'ปิดปรับปรุง', bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30' }
  } : {
    approved: { label: 'อนุมัติแล้ว', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending: { label: 'รอการอนุมัติ', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    rejected: { label: 'ปฏิเสธคำขอ', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    active: { label: 'พร้อมใช้งาน', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
    maintenance: { label: 'ปิดปรับปรุง', bg: 'bg-slate-100 text-slate-600 border-slate-200' }
  };

  const item = configs[status] || (isDark 
    ? { label: status, bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30' }
    : { label: status, bg: 'bg-slate-100 text-slate-600 border-slate-200' });

  return (
    <span className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all \${item.bg}\`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {item.label}
    </span>
  );
}
`);

createFile('frontend/src/components/StatusBadge.test.jsx', `import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';
import { describe, test, expect } from 'vitest';

describe('StatusBadge Component Testing', () => {
  test('แสดงข้อความ อนุมัติแล้ว เมื่อสถานะคือ approved', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText('อนุมัติแล้ว')).toBeInTheDocument();
  });

  test('แสดงข้อความ รอการอนุมัติ เมื่อสถานะคือ pending', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('รอการอนุมัติ')).toBeInTheDocument();
  });
});
`);

createFile('frontend/src/App.jsx', `import React, { useState, useEffect } from 'react';
import { 
  Building2, Calendar, Clock, CheckCircle2, XCircle, Trash2, 
  Search, ShieldAlert, Sparkles, UserCheck, Users, MapPin, 
  ArrowRight, ShieldCheck, Check, X, DoorOpen, Sun, Moon,
  Layers, Info, CheckCircle, ChevronRight
} from 'lucide-react';
import StatusBadge from './components/StatusBadge';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function App() {
  // รองรับการสลับโหมดสี (Default: โหมดสว่าง สะอาดตา คมชัด พรีเซนต์ขึ้นโปรเจกเตอร์ชัดเจน)
  const [isDark, setIsDark] = useState(false);

  // สลับผู้ใช้งานระหว่าง "นักศึกษา" กับ "ผู้ดูแลระบบ (Admin)"
  const [currentUser, setCurrentUser] = useState({
    role: 'student',
    student_id: '68042380112',
    name: 'ธนพัฒน์ ป้อมเย็น'
  });

  const [activeTab, setActiveTab] = useState('spaces'); // 'spaces' | 'bookings'
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalRooms: 0, activeRooms: 0, totalBookings: 0, pendingBookings: 0, approvedBookings: 0 });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form State สำหรับการจอง
  const [bookingForm, setBookingForm] = useState({
    booking_date: new Date().toISOString().split('T')[0],
    time_slot: '09:00 - 12:00',
    purpose: ''
  });

  // ตัวเลือกวัตถุประสงค์ยอดฮิต ช่วยให้คลิกเดียวพิมพ์เสร็จตอนพรีเซนต์
  const quickPurposes = [
    'ทำโครงงาน Web App (Lab 15 Final)',
    'ประชุมทีมและวางแผนการแข่งขัน Esports',
    'บันทึกเทปสัมภาษณ์และพอดแคสต์วิชาการ',
    'ซ้อมนำเสนอผลงานโครงงานคอมพิวเตอร์'
  ];

  const showToast = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3800);
  };

  const fetchData = async () => {
    try {
      const [roomsRes, bookingsRes, statsRes] = await Promise.all([
        fetch(\`\${API_BASE}/rooms\`),
        fetch(\`\${API_BASE}/bookings?student_id=\${currentUser.student_id}&role=\${currentUser.role}\`),
        fetch(\`\${API_BASE}/stats\`)
      ]);

      const rData = await roomsRes.json();
      const bData = await bookingsRes.json();
      const sData = await statsRes.json();

      if (rData.success) setRooms(rData.data);
      if (bData.success) setBookings(bData.data);
      if (sData.success) setStats(sData);
    } catch (err) {
      console.error(err);
      showToast('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ Backend (Port 3000) ได้', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;

    try {
      const res = await fetch(\`\${API_BASE}/bookings\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: selectedRoom.id,
          student_id: currentUser.student_id,
          student_name: currentUser.name,
          ...bookingForm
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'ส่งคำขอจองไม่สำเร็จ');

      showToast(data.message, 'success');
      setSelectedRoom(null);
      setBookingForm({ ...bookingForm, purpose: '' });
      fetchData();
      setActiveTab('bookings');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(\`\${API_BASE}/bookings/\${id}/status\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: \`ปรับปรุงโดย \${currentUser.name}\` })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(data.message, 'success');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      const res = await fetch(\`\${API_BASE}/bookings/\${id}\`, { method: 'DELETE' });
      const data = await res.json();
      showToast(data.message, 'success');
      fetchData();
    } catch (err) {
      showToast('ไม่สามารถลบรายการได้', 'error');
    }
  };

  const handleToggleRoomStatus = async (roomId) => {
    try {
      const res = await fetch(\`\${API_BASE}/rooms/\${roomId}/toggle-status\`, { method: 'PUT' });
      const data = await res.json();
      showToast(data.message, 'success');
      fetchData();
    } catch (err) {
      showToast('ไม่สามารถเปลี่ยนสถานะห้องได้', 'error');
    }
  };

  const categories = ['all', 'Co-Working', 'Studio', 'Esports', 'Meeting', 'Focus Pod'];

  const filteredRooms = rooms.filter(room => {
    const matchesCat = selectedCategory === 'all' || room.category === selectedCategory;
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          room.building.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredBookings = bookings.filter(b => {
    if (bookingFilterStatus === 'all') return true;
    return b.status === bookingFilterStatus;
  });

  return (
    <div className={\`min-h-screen transition-colors duration-300 font-sans \${
      isDark ? 'bg-[#0b0f19] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }\`}>
      {/* Toast Notification */}
      {notification && (
        <div className={\`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-bounce \${
          notification.type === 'error' 
            ? isDark ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-800'
            : isDark ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }\`}>
          {notification.type === 'error' ? <XCircle size={20} className="text-rose-500" /> : <CheckCircle2 size={20} className="text-emerald-500" />}
          <span className="text-sm font-semibold">{notification.text}</span>
        </div>
      )}

      {/* TOP BAR: QUICK DEMO ROLE SWITCHER + THEME TOGGLE */}
      <div className={\`border-b px-4 py-2.5 transition-colors \${
        isDark ? 'bg-[#111827] border-slate-800/80' : 'bg-slate-900 text-white border-slate-800'
      }\`}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-2.5 py-0.5 rounded-lg text-[10px] tracking-wider uppercase shadow-sm">
              Final Demo
            </span>
            <span className="text-slate-300 font-medium">สลับบทบาทในการนำเสนอ:</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setCurrentUser({ role: 'student', student_id: '68042380112', name: 'ธนพัฒน์ ป้อมเย็น' });
                showToast('สลับบทบาท: ธนพัฒน์ ป้อมเย็น (นักศึกษา)');
              }}
              className={\`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 \${
                currentUser.role === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }\`}
            >
              <UserCheck size={14} />
              <span>ธนพัฒน์ (นักศึกษา)</span>
            </button>

            <button
              onClick={() => {
                setCurrentUser({ role: 'admin', student_id: 'ADMIN01', name: 'ผศ.ดร.สมเกียรติ (แอดมิน)' });
                showToast('สลับบทบาท: ผู้ดูแลระบบ (Admin)');
              }}
              className={\`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 \${
                currentUser.role === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }\`}
            >
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>ผศ.ดร.สมเกียรติ (Admin)</span>
            </button>

            {/* THEME TOGGLE: ตอบโจทย์ฟังก์ชัน Dark Mode ในใบงาน 3.2 */}
            <div className="h-4 w-px bg-slate-700 mx-1"></div>
            <button
              onClick={() => {
                setIsDark(!isDark);
                showToast(isDark ? 'เปลี่ยนเป็น: โหมดสว่าง (Light Mode)' : 'เปลี่ยนเป็น: โหมดมืด (Dark Mode)');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 transition flex items-center gap-1.5 font-medium"
              title="สลับโหมดสี สว่าง / มืด"
            >
              {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-300" />}
              <span className="text-[11px] text-slate-200">{isDark ? 'สว่าง' : 'มืด'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <header className={\`border-b sticky top-0 z-30 backdrop-blur-xl transition-colors \${
        isDark ? 'bg-[#0e1424]/90 border-slate-800/80' : 'bg-white/90 border-slate-200/90 shadow-sm'
      }\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={\`text-xl font-extrabold tracking-tight \${
                    isDark ? 'text-white' : 'text-slate-900'
                  }\`}>
                    Space<span className="text-indigo-600">Flow</span>
                  </h1>
                  <span className={\`text-[11px] px-2.5 py-0.5 rounded-full font-bold border \${
                    isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }\`}>
                    Campus Space Booking
                  </span>
                </div>
                <p className={\`text-xs mt-0.5 \${isDark ? 'text-slate-400' : 'text-slate-500'}\`}>
                  ระบบบริหารและจองพื้นที่อัจฉริยะ (Lab 15 Final) • โดย ธนพัฒน์ ป้อมเย็น
                </p>
              </div>
            </div>

            {/* TAB BUTTONS */}
            <div className={\`flex items-center gap-1.5 p-1.5 rounded-2xl border \${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
            }\`}>
              <button
                onClick={() => setActiveTab('spaces')}
                className={\`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 \${
                  activeTab === 'spaces'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }\`}
              >
                <DoorOpen size={16} />
                <span>สำรวจพื้นที่ ({rooms.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={\`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 \${
                  activeTab === 'bookings'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }\`}
              >
                <Calendar size={16} />
                <span>{currentUser.role === 'admin' ? 'จัดการคำขอทั้งหมด' : 'ประวัติการจองของฉัน'}</span>
                <span className={\`px-2 py-0.5 rounded-full text-xs font-bold \${
                  activeTab === 'bookings'
                    ? 'bg-indigo-700 text-white'
                    : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                }\`}>
                  {bookings.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className={\`p-5 rounded-3xl border shadow-sm transition flex items-center justify-between \${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80'
          }\`}>
            <div>
              <p className={\`text-xs font-bold uppercase tracking-wider \${isDark ? 'text-slate-400' : 'text-slate-500'}\`}>พื้นที่ทั้งหมด</p>
              <h3 className={\`text-2xl font-black mt-1 \${isDark ? 'text-white' : 'text-slate-900'}\`}>{stats.totalRooms} ห้อง</h3>
              <p className="text-[11px] text-slate-400 mt-1">สตูดิโอ & ห้องประชุม</p>
            </div>
            <div className={\`p-3.5 rounded-2xl border \${
              isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
            }\`}>
              <Building2 size={24} />
            </div>
          </div>

          <div className={\`p-5 rounded-3xl border shadow-sm transition flex items-center justify-between \${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80'
          }\`}>
            <div>
              <p className={\`text-xs font-bold uppercase tracking-wider \${isDark ? 'text-slate-400' : 'text-slate-500'}\`}>พร้อมใช้งาน</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.activeRooms} ห้อง</h3>
              <p className="text-[11px] text-emerald-600/80 mt-1 font-medium">เปิดรับคำขอจองทันที</p>
            </div>
            <div className={\`p-3.5 rounded-2xl border \${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }\`}>
              <Sparkles size={24} />
            </div>
          </div>

          <div className={\`p-5 rounded-3xl border shadow-sm transition flex items-center justify-between \${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80'
          }\`}>
            <div>
              <p className={\`text-xs font-bold uppercase tracking-wider \${isDark ? 'text-slate-400' : 'text-slate-500'}\`}>รอการอนุมัติ</p>
              <h3 className="text-2xl font-black text-amber-500 mt-1">{stats.pendingBookings} รายการ</h3>
              <p className="text-[11px] text-amber-600/80 mt-1 font-medium">รอผู้ดูแลตรวจสอบ</p>
            </div>
            <div className={\`p-3.5 rounded-2xl border \${
              isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100'
            }\`}>
              <Clock size={24} />
            </div>
          </div>

          <div className={\`p-5 rounded-3xl border shadow-sm transition flex items-center justify-between \${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80'
          }\`}>
            <div>
              <p className={\`text-xs font-bold uppercase tracking-wider \${isDark ? 'text-slate-400' : 'text-slate-500'}\`}>อนุมัติเรียบร้อย</p>
              <h3 className="text-2xl font-black text-indigo-600 mt-1">{stats.approvedBookings} รายการ</h3>
              <p className="text-[11px] text-indigo-600/80 mt-1 font-medium">ยืนยันสิทธิ์สำเร็จ</p>
            </div>
            <div className={\`p-3.5 rounded-2xl border \${
              isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
            }\`}>
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {activeTab === 'spaces' && (
          <div className="space-y-6">
            {/* SEARCH & CATEGORY FILTER */}
            <div className={\`p-4 rounded-3xl border flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm \${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200/90'
            }\`}>
              <div className="relative w-full md:w-96">
                <Search className={\`absolute left-3.5 top-3 \${isDark ? 'text-slate-400' : 'text-slate-400'}\`} size={18} />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อห้อง, สตูดิโอ หรืออาคาร..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={\`w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition border \${
                    isDark 
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }\`}
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={\`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition \${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : isDark
                          ? 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }\`}
                  >
                    {cat === 'all' ? '✨ ทั้งหมด' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div 
                  key={room.id}
                  className={\`rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group \${
                    isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/90 hover:border-indigo-300'
                  }\`}
                >
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={room.image_url} 
                      alt={room.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3.5 right-3.5">
                      <StatusBadge status={room.status} isDark={isDark} />
                    </div>

                    <div className="absolute bottom-3 left-4">
                      <span className="text-[11px] font-black uppercase tracking-wider text-white bg-slate-900/70 border border-white/20 px-3 py-1 rounded-xl backdrop-blur-md">
                        {room.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className={\`text-lg font-bold mb-2 leading-snug \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                        {room.name}
                      </h4>
                      
                      <div className={\`flex flex-wrap items-center gap-3 text-xs mb-3.5 font-medium \${isDark ? 'text-slate-300' : 'text-slate-600'}\`}>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={15} className="text-indigo-500" /> {room.building} ({room.floor})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={15} className="text-indigo-500" /> สูงสุด {room.capacity} คน
                        </span>
                      </div>

                      <div className={\`p-3 rounded-2xl text-xs font-medium border leading-relaxed \${
                        isDark ? 'bg-slate-800/60 border-slate-800 text-indigo-300' : 'bg-indigo-50/60 border-indigo-100 text-indigo-900'
                      }\`}>
                        ⚡ <strong>สิ่งอำนวยความสะดวก:</strong> {room.amenities}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => setSelectedRoom(room)}
                        disabled={room.status !== 'active'}
                        className={\`w-full py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all \${
                          room.status === 'active'
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30'
                            : isDark ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        }\`}
                      >
                        <span>{room.status === 'active' ? 'จองพื้นที่ห้องนี้' : 'งดให้บริการชั่วคราว'}</span>
                        {room.status === 'active' && <ArrowRight size={16} />}
                      </button>

                      {/* Admin Toggle Status Button */}
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => handleToggleRoomStatus(room.id)}
                          className={\`w-full py-2 rounded-xl text-xs font-semibold border transition \${
                            isDark 
                              ? 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800' 
                              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                          }\`}
                        >
                          {room.status === 'active' ? '🔴 สั่งปิดปรับปรุง (Admin)' : '🟢 สั่งเปิดใช้งาน (Admin)'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className={\`rounded-3xl border shadow-sm overflow-hidden \${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/90'
          }\`}>
            <div className={\`p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 \${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }\`}>
              <div>
                <h3 className={\`text-lg font-bold \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                  {currentUser.role === 'admin' ? 'รายการคำขอจองทั้งหมดในระบบ' : 'ประวัติและสถานะการจองของฉัน'}
                </h3>
                <p className={\`text-xs mt-1 \${isDark ? 'text-slate-400' : 'text-slate-500'}\`}>
                  {currentUser.role === 'admin'
                    ? 'สิทธิ์ผู้ดูแลระบบ: ตรวจสอบและกด อนุมัติ / ปฏิเสธ คำขอได้แบบเรียลไทม์'
                    : \`ข้อมูลการจองของ: \${currentUser.name} (รหัส \${currentUser.student_id})\`}
                </p>
              </div>

              {/* Status Filter for Bookings */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {['all', 'pending', 'approved', 'rejected'].map(st => (
                  <button
                    key={st}
                    onClick={() => setBookingFilterStatus(st)}
                    className={\`px-3 py-1.5 rounded-xl transition \${
                      bookingFilterStatus === st
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }\`}
                  >
                    {st === 'all' ? 'ทั้งหมด' : st === 'pending' ? 'รออนุมัติ' : st === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                  </button>
                ))}
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Calendar size={48} className="mx-auto mb-3 opacity-30 text-indigo-500" />
                <p className="text-sm font-semibold">ไม่พบรายการจองตามเงื่อนไขที่เลือก</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={\`text-xs uppercase border-b font-bold tracking-wider \${
                    isDark ? 'bg-[#0e1424] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }\`}>
                    <tr>
                      <th className="py-4 px-6">ห้องที่จอง</th>
                      <th className="py-4 px-6">ผู้ขอจอง</th>
                      <th className="py-4 px-6">วัน / ช่วงเวลา</th>
                      <th className="py-4 px-6">วัตถุประสงค์</th>
                      <th className="py-4 px-6 text-center">สถานะ</th>
                      <th className="py-4 px-6 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className={\`divide-y \${isDark ? 'divide-slate-800/70' : 'divide-slate-100'}\`}>
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className={\`transition \${
                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                      }\`}>
                        <td className={\`py-4 px-6 font-bold \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                          {b.room_name}
                        </td>
                        <td className="py-4 px-6">
                          <p className={\`font-semibold \${isDark ? 'text-slate-200' : 'text-slate-800'}\`}>{b.student_name}</p>
                          <p className="text-xs text-slate-400">{b.student_id}</p>
                        </td>
                        <td className="py-4 px-6 text-xs">
                          <div className={\`font-bold \${isDark ? 'text-slate-300' : 'text-slate-700'}\`}>{b.booking_date}</div>
                          <div className="text-indigo-600 font-semibold">{b.time_slot}</div>
                        </td>
                        <td className={\`py-4 px-6 text-xs max-w-xs truncate \${isDark ? 'text-slate-300' : 'text-slate-600'}\`}>
                          {b.purpose}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <StatusBadge status={b.status} isDark={isDark} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          {currentUser.role === 'admin' ? (
                            <div className="flex items-center justify-end gap-2">
                              {b.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(b.id, 'approved')}
                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition border border-emerald-200"
                                    title="อนุมัติคำขอจอง"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(b.id, 'rejected')}
                                    className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition border border-rose-200"
                                    title="ปฏิเสธคำขอจอง"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                                title="ลบรายการจอง"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="text-xs text-rose-600 hover:underline font-semibold"
                            >
                              ยกเลิกคำขอ
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className={\`rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border space-y-5 transition-all animate-in fade-in zoom-in-95 duration-200 \${
            isDark ? 'bg-[#111827] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }\`}>
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black">ส่งคำขอจองพื้นที่</h3>
                  <p className="text-xs text-indigo-600 font-bold mt-0.5">ห้อง: {selectedRoom.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">ผู้ขอจอง (อิงตามผู้ใช้ปัจจุบัน)</label>
                <input
                  type="text"
                  disabled
                  value={\`\${currentUser.name} (\${currentUser.student_id})\`}
                  className={\`w-full px-4 py-2.5 rounded-2xl text-xs font-semibold cursor-not-allowed border \${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }\`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">วันที่ต้องการจอง *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.booking_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, booking_date: e.target.value })}
                    className={\`w-full px-3 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 border \${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }\`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">ช่วงเวลา *</label>
                  <select
                    value={bookingForm.time_slot}
                    onChange={(e) => setBookingForm({ ...bookingForm, time_slot: e.target.value })}
                    className={\`w-full px-3 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 border \${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }\`}
                  >
                    <option value="09:00 - 12:00">09:00 - 12:00 (เช้า)</option>
                    <option value="13:00 - 16:00">13:00 - 16:00 (บ่าย)</option>
                    <option value="16:30 - 19:30">16:30 - 19:30 (เย็น)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-500">วัตถุประสงค์การใช้งาน *</label>
                  <span className="text-[10px] text-slate-400">เลือกตัวเลือกด่วนด้านล่างได้</span>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="เช่น ทำโครงงาน Web Application พัฒนาเว็บไฟนอล Lab 15..."
                  value={bookingForm.purpose}
                  onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                  className={\`w-full px-4 py-2.5 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 border \${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }\`}
                />

                {/* Quick Suggestion Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {quickPurposes.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, purpose: p })}
                      className={\`text-[10px] px-2.5 py-1 rounded-lg border transition font-medium \${
                        isDark 
                          ? 'bg-slate-800/80 border-slate-700 text-indigo-300 hover:bg-slate-700' 
                          : 'bg-indigo-50/70 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                      }\`}
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className={\`flex-1 py-3 border rounded-2xl text-xs font-bold transition \${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }\`}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
                >
                  ยืนยันส่งคำขอจอง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`);

createFile('README.md', `# 🚀 SpaceFlow - Smart Campus Studio & Space Booking
โครงงานพัฒนาเว็บแอปพลิเคชันด้วย React (Lab 15: Final Project)

## ผู้จัดทำ
- **ชื่อ - สกุล:** นายธนพัฒน์ ป้อมเย็น
- **รหัสนักศึกษา:** 68042380112
- **สาขาวิชา:** วิทยาการคอมพิวเตอร์

## จุดเด่นของระบบ (เกรด A+)
1. **Modern Dark UI:** ดีไซน์สไตล์ SaaS ระดับโมเดิร์น พร้อมรูปภาพสตูดิโอจริงและเอฟเฟกต์ Glassmorphism
2. **Demo Role Switcher:** คลิกเดียวสลับบทบาทระหว่าง "นักศึกษา (ธนพัฒน์)" และ "ผู้ดูแลระบบ (Admin)" ได้ทันที
3. **Conflict Prevention (409):** ระบบป้องกันการจองห้องเดียวกันในวันและเวลาเดียวกันซ้ำอย่างแม่นยำ
4. **Approval Lifecycle:** คำขอเริ่มต้นที่สถานะ \`pending\` แอดมินสามารถกดอนุมัติ (\`approved\`) หรือปฏิเสธ (\`rejected\`) ได้แบบเรียลไทม์
5. **Room Management:** แอดมินสามารถสั่งเปิด-ปิดปรับปรุงห้อง (Maintenance) ได้ทันที

## วิธีการรันระบบ
\`\`\`bash
# 1. ฝั่ง Backend (Port 3000)
cd backend
npm install
npm run dev

# 2. ฝั่ง Frontend (Port 5173) - เปิด Terminal ใหม่อีกจอ
cd frontend
npm install
npm run dev
\`\`\`
`);

console.log('\n===============================================================');
console.log('🎉 อัปเกรดระบบ SpaceFlow สไตล์ Ultra-Modern สำเร็จเรียบร้อย!');
console.log('===============================================================');
console.log('👉 วิธีการเริ่มรัน:');
console.log('1. node setup_project.js (ถ้ายังไม่ได้แตกไฟล์)');
console.log('2. Terminal 1: cd backend && npm install && npm run dev');
console.log('3. Terminal 2: cd frontend && npm install && npm run dev');
console.log('4. เปิดเบราว์เซอร์ที่: http://localhost:5173');
console.log('===============================================================\n');