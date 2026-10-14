import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Building2, Users, Calendar, Clock, CheckCircle2, XCircle, 
  Trash2, Search, Sparkles, Shield, User, AlertCircle,
  Sun, Moon, ChevronRight, Check, MapPin, 
  Volume2, Download, HelpCircle,
  BarChart3, PieChart, AlertTriangle,
  Plus, CheckSquare, Square, VolumeX,
  TrendingUp, Compass, Smartphone, LayoutGrid
} from 'lucide-react';

const API_BASE = typeof window !== 'undefined' && window.__API_BASE 
  ? window.__API_BASE 
  : (import.meta.env?.VITE_API_URL || 'http://localhost:3000/api');

// ช่วงเวลาให้บริการมาตรฐานของมหาวิทยาลัย
const OPERATIONAL_SLOTS = [
  '08:30 - 10:30',
  '10:30 - 12:30',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '17:00 - 19:00',
  '19:00 - 21:00'
];

const INITIAL_ROOMS_CATALOG = [
  {
    id: 1,
    name: 'Studio 101: สตูดิโอบันทึกเสียง & พอดแคสต์ระดับโปร',
    category: 'Studio',
    building: 'อาคาร 4 คณะวิทยาศาสตร์',
    floor: 'ชั้น 2 (ห้อง 4201)',
    capacity: 6,
    status: 'active',
    rating: 4.9,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    description: 'ห้องสตูดิโอบันทึกเสียงบุแผ่นซับเสียงหนาพิเศษ Acoustic Grade ป้องกันเสียงรบกวนภายนอก 100% เหมาะสำหรับงานอัดเสียง ร้องเพลง พอดแคสต์ สตรีมมิง และตัดต่อสื่อมัลติมีเดีย',
    amenities: ['ไมโครโฟน Shure SM7B x4', 'Audio Interface Focusrite 18i20', 'แผ่นซับเสียง Acoustic Foam', 'ไฟสตูดิโอ LED Nanlite', 'หูฟัง Studio Monitor M50x'],
    extraEquipment: ['ฉากเขียว Green Screen 3x3m', 'ขาตั้งกล้อง Heavy Duty', 'การ์ดเสียงสำรอง']
  },
  {
    id: 2,
    name: 'Co-Meeting Lounge A: ห้องประชุมและระดมความคิดอัจฉริยะ',
    category: 'Meeting',
    building: 'อาคารวิทยบริการและเทคโนโลยี',
    floor: 'ชั้น 3 (โซน Innovation)',
    capacity: 12,
    status: 'active',
    rating: 4.8,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    description: 'พื้นที่ประชุมกลุ่มขนาดกลางพร้อมระบบ Smart Video Conference รองรับการต่อขยายจอไร้สาย กระดานไวท์บอร์ดกระจก และระบบไฟปรับอุณหภูมิสีตามโหมดการระดมความคิด',
    amenities: ['จอ Interactive Smart TV 75 นิ้ว', 'กล้องไมค์ Logitech MeetUp 4K', 'กระดานกระจก Magnetic Whiteboard', 'พอร์ตชาร์จ Type-C 100W ทุกที่นั่ง', 'ระบบเสียง Beamforming'],
    extraEquipment: ['ชุดปากกาเขียนจออัจฉริยะ', 'รีโมท Presentation Clicker', 'กระดาษ Post-it & มาร์กเกอร์']
  },
  {
    id: 3,
    name: 'Esports & Live Streaming Arena: ห้องซ้อมแข่งขันเกมอีสปอร์ต',
    category: 'Esports',
    building: 'ศูนย์คอมพิวเตอร์และสารสนเทศ',
    floor: 'ชั้น 4 (Cyber Space)',
    capacity: 8,
    status: 'active',
    rating: 5.0,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    description: 'ห้องซ้อมแข่งขันกีฬาอีสปอร์ตและสตรีมมิงเต็มรูปแบบ คอมพิวเตอร์สเปกสูงสุดระดับการแข่งขันระดับประเทศ โต๊ะเก้าอี้ Ergonomic Gaming และระบบเน็ตเวิร์ก LAN แยกสายเฉพาะ 2.5Gbps',
    amenities: ['PC Gaming RTX 4080 Super x8', 'จอ BenQ ZOWIE 240Hz x8', 'เน็ตเวิร์ก Dedicated Fiber 2Gbps', 'เก้าอี้ Secretlab Titan Evo', 'Capture Card Elgato 4K60 Pro'],
    extraEquipment: ['เว็บแคม Elgato Facecam Pro', 'ไฟ Key Light Air x4', 'Stream Deck XL']
  },
  {
    id: 4,
    name: 'Focus Pod B2: ตู้ทำงานและสัมภาษณ์เก็บเสียงส่วนบุคคล',
    category: 'Focus Pod',
    building: 'หอสมุดกลางเฉลิมพระเกียรติ',
    floor: 'ชั้น 1 (Silent Zone)',
    capacity: 2,
    status: 'maintenance',
    rating: 4.7,
    reviewCount: 24,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    description: 'ตู้เก็บเสียงส่วนตัวระบบ Acoustic Ventilation เหมาะสำหรับการสัมภาษณ์งานออนไลน์ การประชุมออนไลน์สำคัญ หรือการอ่านหนังสือที่ต้องการสมาธิสูงสุดโดยปราศจากเสียงรบกวน',
    amenities: ['กระจกนิรภัยกันเสียง Soundproof 38dB', 'ระบบระบายอากาศอัตโนมัติ Ultra-Quiet', 'โคมไฟปรับหรี่แสง Stepless', 'ปลั๊กไฟสากลพร้อม Fast Charge'],
    extraEquipment: ['แท่นวางแล็ปท็อปปรับระดับ', 'เก้าอี้ Ergonomic เบาะผ้าตาข่าย']
  },
  {
    id: 5,
    name: 'Creative Workshop Room: ห้องปฏิบัติการออกแบบและสร้างโมเดล',
    category: 'Workshop',
    building: 'อาคารเฉลิมพระเกียรติ 50 พรรษา',
    floor: 'ชั้น 5 (Design Hub)',
    capacity: 16,
    status: 'active',
    rating: 4.9,
    reviewCount: 41,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    description: 'ห้องสำหรับทำโครงงานฮาร์ดแวร์ สร้างต้นแบบ และงานออกแบบนวัตกรรม มีปลั๊กไฟลอยจากเพดาน โต๊ะปฏิบัติการผิวทนความร้อน และอุปกรณ์ตัดต่อชิ้นงานพื้นฐาน',
    amenities: ['ปลั๊กไฟ Drop-down จากเพดาน 8 จุด', 'โต๊ะ Workbench ทนทานความร้อนสูง', 'พัดลมดูดควันบัดกรีระบบกรอง HEPA', 'จอแสดงผล Presenter 65 นิ้ว'],
    extraEquipment: ['ชุดหัวแร้งบัดกรีปรับอุณหภูมิได้', 'มัลติมิเตอร์ Digital Oscilloscope', 'เครื่องตัดแผ่นอะคริลิก']
  }
];

const INITIAL_BOOKINGS_CATALOG = [
  {
    id: 101,
    room_id: 1,
    room_name: 'Studio 101: สตูดิโอบันทึกเสียง & พอดแคสต์ระดับโปร',
    student_id: '68042380112',
    student_name: 'ธนพัฒน์ ป้อมเย็น',
    date: new Date().toISOString().split('T')[0],
    time_slot: '10:30 - 12:30',
    purpose: 'บันทึกเสียงและคลิปวิดีโอสาธิตการทำงานโครงงาน Web Application Lab 15 Final',
    attendees_count: 3,
    extra_items: ['ไมโครโฟน Shure SM7B x4', 'ขาตั้งกล้อง Heavy Duty'],
    status: 'approved',
    admin_notes: 'อนุมัติเรียบร้อย กรุณาติดต่อขอรับกุญแจที่เคาน์เตอร์ชั้น 2',
    created_at: '2026-10-10T09:30:00Z'
  },
  {
    id: 102,
    room_id: 3,
    room_name: 'Esports & Live Streaming Arena: ห้องซ้อมแข่งขันเกมอีสปอร์ต',
    student_id: '68042380199',
    student_name: 'สมศรี ใจมั่น',
    date: new Date().toISOString().split('T')[0],
    time_slot: '13:00 - 15:00',
    purpose: 'ฝึกซ้อมการแข่งขัน Valorant Campus Tournament รอบคัดเลือก',
    attendees_count: 5,
    extra_items: ['เว็บแคม Elgato Facecam Pro'],
    status: 'pending',
    admin_notes: '',
    created_at: '2026-10-11T14:15:00Z'
  },
  {
    id: 103,
    room_id: 2,
    room_name: 'Co-Meeting Lounge A: ห้องประชุมและระดมความคิดอัจฉริยะ',
    student_id: '68042380112',
    student_name: 'ธนพัฒน์ ป้อมเย็น',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time_slot: '15:00 - 17:00',
    purpose: 'ประชุมจัดทำเอกสารและสไลด์นำเสนอโครงงานวิชา 4123307',
    attendees_count: 4,
    extra_items: ['รีโมท Presentation Clicker'],
    status: 'approved',
    admin_notes: 'อนุมัติแล้ว ดูแลรักษาความสะอาดของกระดานกระจกด้วยครับ',
    created_at: '2026-10-11T16:00:00Z'
  }
];

function normalizeDateOnly(rawDate) {
  if (!rawDate) return new Date().toISOString().split('T')[0];
  if (typeof rawDate === 'string') {
    return rawDate.slice(0, 10);
  }
  try {
    return new Date(rawDate).toISOString().split('T')[0];
  } catch {
    return String(rawDate).slice(0, 10);
  }
}

function normalizeExtraItems(rawItems) {
  if (!rawItems) return [];
  if (Array.isArray(rawItems)) return rawItems;
  if (typeof rawItems === 'string') {
    try {
      const parsed = JSON.parse(rawItems);
      return Array.isArray(parsed) ? parsed : [String(rawItems)];
    } catch {
      return rawItems.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignored
    }
  }

  playSuccess() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      osc.frequency.setValueAtTime(1046.50, now + 0.24);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Ignored
    }
  }

  playError() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(220, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Ignored
    }
  }
}

const sounds = new SoundEngine();

function formatThaiDate(dateString) {
  if (!dateString) return '-';
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const year = parseInt(parts[0], 10) + 543;
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    return `${day} ${thaiMonths[monthIndex] || parts[1]} ${year}`;
  } catch {
    return dateString;
  }
}

function getNextDays(count = 7) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const dayName = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'][d.getDay()];
    const fullDayName = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'][d.getDay()];
    days.push({ 
      iso, 
      dayName, 
      fullDayName,
      shortDate: `${d.getDate()}/${d.getMonth() + 1}`,
      display: `${dayName} ${d.getDate()}/${d.getMonth() + 1}` 
    });
  }
  return days;
}

function exportBookingsToCSV(bookingsList) {
  if (!bookingsList || bookingsList.length === 0) return;
  const headers = ['Booking ID', 'Room Name', 'Student ID', 'Student Name', 'Date', 'Time Slot', 'Attendees', 'Status', 'Purpose'];
  const rows = bookingsList.map(b => [
    b.id,
    `"${(b.room_name || '').replace(/"/g, '""')}"`,
    b.student_id,
    `"${(b.student_name || '').replace(/"/g, '""')}"`,
    b.date,
    `"${b.time_slot}"`,
    b.attendees_count || 1,
    b.status,
    `"${(b.purpose || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SpaceFlow_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function PureQRCodeBadge({ text = 'SPACEFLOW', size = 68 }) {
  const hash = Array.from(String(text)).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000003, 7);
  const gridSize = 15;
  const cellSize = size / gridSize;
  const cells = [];

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const isCornerPattern = (r < 4 && c < 4) || (r < 4 && c >= gridSize - 4) || (r >= gridSize - 4 && c < 4);
      let isFilled = false;
      if (isCornerPattern) {
        if ((r === 0 || r === 3 || c === 0 || c === 3) && r < 4 && c < 4) isFilled = true;
        else if (r >= 1 && r <= 2 && c >= 1 && c <= 2 && r < 4 && c < 4) isFilled = true;
        else if ((r === 0 || r === 3 || c === gridSize - 4 || c === gridSize - 1) && r < 4 && c >= gridSize - 4) isFilled = true;
        else if (r >= 1 && r <= 2 && c >= gridSize - 3 && c <= gridSize - 2 && r < 4 && c >= gridSize - 4) isFilled = true;
        else if ((r === gridSize - 4 || r === gridSize - 1 || c === 0 || c === 3) && r >= gridSize - 4 && c < 4) isFilled = true;
        else if (r >= gridSize - 3 && r <= gridSize - 2 && c >= 1 && c <= 2 && r >= gridSize - 4 && c < 4) isFilled = true;
      } else {
        const val = (r * 17 + c * 23 + hash) % 7;
        isFilled = val === 0 || val === 2 || val === 4 || val === 5;
      }
      if (isFilled) {
        cells.push(
          <rect 
            key={`${r}-${c}`} 
            x={c * cellSize} 
            y={r * cellSize} 
            width={cellSize * 0.88} 
            height={cellSize * 0.88} 
            rx={cellSize * 0.18}
            fill="#0f172a"
          />
        );
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      <rect width={size} height={size} fill="#ffffff" rx={4} />
      {cells}
    </svg>
  );
}

function StatusBadge({ status, size = 'md' }) {
  const configs = {
    approved: {
      label: 'อนุมัติแล้ว',
      classes: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60 font-black',
      dot: 'bg-emerald-600 dark:bg-emerald-400 animate-pulse'
    },
    pending: {
      label: 'รอการอนุมัติ',
      classes: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/60 font-black',
      dot: 'bg-amber-600 dark:bg-amber-400'
    },
    rejected: {
      label: 'ปฏิเสธคำขอ',
      classes: 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700/60 font-black',
      dot: 'bg-rose-600 dark:bg-rose-400'
    },
    active: {
      label: 'พร้อมใช้งาน',
      classes: 'bg-teal-100 text-teal-950 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-700/60 font-black',
      dot: 'bg-teal-600 dark:bg-teal-400'
    },
    maintenance: {
      label: 'ปิดปรับปรุง',
      classes: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-bold',
      dot: 'bg-slate-500'
    }
  };

  const item = configs[status] || {
    label: status,
    classes: 'bg-slate-100 text-slate-800 border-slate-300 font-bold',
    dot: 'bg-slate-500'
  };

  const pad = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs transition-all whitespace-nowrap shrink-0 ${pad} ${item.classes}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
      <span>{item.label}</span>
    </span>
  );
}

function ToastNotificationCenter({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50 flex flex-col gap-2.5 sm:max-w-sm w-auto pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            toast.type === 'error'
              ? 'bg-rose-950/95 text-rose-200 border-rose-500/50'
              : toast.type === 'warning'
              ? 'bg-amber-950/95 text-amber-200 border-amber-500/50'
              : 'bg-slate-900/95 text-white border-indigo-500/40'
          }`}>
          <div className="mt-0.5 shrink-0">
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-400" />}
          </div>
          <div className="flex-1 text-xs">
            {toast.title && <div className="font-extrabold text-sm mb-0.5">{toast.title}</div>}
            <div className="font-medium leading-relaxed opacity-90">{toast.message}</div>
          </div>
          <button 
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition shrink-0">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function CustomConfirmDialog({ isOpen, title, message, confirmText = 'ยืนยัน', cancelText = 'ยกเลิก', isDanger = false, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl text-slate-800 dark:text-slate-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl shrink-0 ${isDanger ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600' : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600'}`}>
            {isDanger ? <AlertTriangle className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">การดำเนินการนี้จะมีผลต่อข้อมูลในระบบทันที</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          {message}
        </p>
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button 
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200">
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition ${
              isDanger 
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const QUICK_PURPOSE_SUGGESTIONS = [
  'ซ้อมนำเสนอโครงงานวิชา 4123307 (Lab 15 Final)',
  'บันทึกเทปพอดแคสต์สัมภาษณ์และตัดต่อเสียงส่งประกวด',
  'ประชุมทีมวางแผนการแข่งขัน Valorant Campus Series',
  'จัดติวเข้มและทบทวนเนื้อหาก่อนสอบปลายภาครายวิชาคอมพิวเตอร์',
  'ถ่ายทำคลิปวิดีโอประชาสัมพันธ์กิจกรรมชมรมเทคโนโลยี'
];

function BookingWizardModal({ isOpen, onClose, room, initialDate, initialSlot, bookings, onSubmitBooking }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(initialSlot || '');
  const [studentId, setStudentId] = useState('68042380112');
  const [studentName, setStudentName] = useState('ธนพัฒน์ ป้อมเย็น');
  const [attendeesCount, setAttendeesCount] = useState(2);
  const [purpose, setPurpose] = useState('');
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  useEffect(() => {
    if (isOpen && room) {
      setStep(1);
      setDate(initialDate || new Date().toISOString().split('T')[0]);
      setSelectedSlot(initialSlot || '');
      setPurpose('');
      setSelectedEquipments([]);
      setAgreedTerms(false);
      setErrorText('');
      setConfirmedBookingData(null);
    }
  }, [isOpen, room, initialDate, initialSlot]);

  if (!isOpen || !room) return null;

  const slotAvailability = OPERATIONAL_SLOTS.map(slot => {
    const isBooked = bookings.some(b => 
      b.room_id === room.id && 
      b.date === date && 
      b.time_slot === slot && 
      b.status !== 'rejected'
    );
    return { slot, isBooked };
  });

  const toggleEquipment = (item) => {
    sounds.playClick();
    setSelectedEquipments(prev => 
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleNextStep1 = () => {
    if (!selectedSlot) {
      sounds.playError();
      setErrorText('กรุณาเลือกช่วงเวลาที่ต้องการใช้งานก่อนดำเนินการต่อ');
      return;
    }
    sounds.playClick();
    setErrorText('');
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!studentId || !studentName) {
      sounds.playError();
      setErrorText('กรุณากรอกรหัสนักศึกษาและชื่อ-นามสกุลให้ครบถ้วน');
      return;
    }
    sounds.playClick();
    setErrorText('');
    setStep(3);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!purpose.trim()) {
      sounds.playError();
      setErrorText('กรุณาระบุวัตถุประสงค์การใช้งานห้อง');
      return;
    }
    if (!agreedTerms) {
      sounds.playError();
      setErrorText('กรุณายอมรับเงื่อนไขการดูแลรักษาความสะอาดและทรัพย์สิน');
      return;
    }

    setErrorText('');

    const payload = {
      room_id: room.id,
      room_name: room.name,
      student_id: studentId,
      student_name: studentName,
      date,
      time_slot: selectedSlot,
      purpose: purpose.trim(),
      attendees_count: Number(attendeesCount),
      extra_items: selectedEquipments
    };

    const result = await onSubmitBooking(payload);
    if (result && result.success) {
      sounds.playSuccess();
      setErrorText('');
      setConfirmedBookingData(result.data || payload);
      setStep(4);
    } else {
      sounds.playError();
      setErrorText(result?.message || 'ส่งคำขอจองไม่สำเร็จ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f172a] border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        
        {/* Wizard Header */}
        <div className="relative bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 text-white p-5 sm:p-6 pb-4 sm:pb-5 border-b border-indigo-500/20">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
            ✕
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/40">
              {step <= 3 ? `ขั้นตอนที่ ${step} จาก 3` : '✅ จองสำเร็จ • บัตรคิวดิจิทัล'}
            </span>
            <span className="text-xs text-indigo-200">• {room.category}</span>
          </div>
          <h2 className="text-base sm:text-lg font-black pr-8 leading-snug">{room.name}</h2>
          <p className="text-xs text-indigo-200 mt-0.5">{room.building} ({room.floor})</p>

          <div className="grid grid-cols-3 gap-2 mt-3.5">
            <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-amber-400' : 'bg-white/20'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-amber-400' : 'bg-white/20'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-amber-400' : 'bg-white/20'}`} />
          </div>
        </div>

        {/* Wizard Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-800 dark:text-slate-100 text-xs custom-scrollbar">
          {step < 4 && errorText && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  1. เลือกวันที่ต้องการใช้งาน *
                </label>
                <input 
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => { setDate(e.target.value); setSelectedSlot(''); setErrorText(''); }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex flex-wrap justify-between items-center gap-1 mb-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    2. เลือกช่วงเวลา ({formatThaiDate(date)}) *
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">ตรวจเช็กเวลาชนกันอัตโนมัติ</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {slotAvailability.map(({ slot, isBooked }) => (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => { setSelectedSlot(slot); sounds.playClick(); setErrorText(''); }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                        isBooked
                          ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed opacity-60'
                          : selectedSlot === slot
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-black ring-2 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 bg-white dark:bg-slate-800/60 font-semibold text-slate-800 dark:text-slate-200'
                      }`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 opacity-70 shrink-0" />
                        <span className="text-xs font-bold">{slot}</span>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap ${isBooked ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'}`}>
                        {isBooked ? 'เต็มแล้ว' : 'ว่าง'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">รหัสนักศึกษา *</label>
                  <input 
                    type="text"
                    value={studentId}
                    onChange={e => { setStudentId(e.target.value); setErrorText(''); }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">ชื่อ-นามสกุล *</label>
                  <input 
                    type="text"
                    value={studentName}
                    onChange={e => { setStudentName(e.target.value); setErrorText(''); }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  จำนวนผู้เข้าร่วมใช้งาน (ความจุสูงสุด {room.capacity} คน)
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range"
                    min="1"
                    max={room.capacity}
                    value={attendeesCount}
                    onChange={e => setAttendeesCount(e.target.value)}
                    className="w-full accent-indigo-600"
                  />
                  <span className="font-extrabold text-sm px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {attendeesCount} คน
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  เบิกอุปกรณ์เสริมพิเศษสำหรับห้องนี้ (Optional)
                </label>
                <div className="space-y-2">
                  {room.extraEquipment && room.extraEquipment.map((item, idx) => {
                    const isChecked = selectedEquipments.includes(item);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleEquipment(item)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition text-left ${
                          isChecked 
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold' 
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}>
                        <span className="flex items-center gap-2 pr-2">
                          {isChecked ? <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                          <span>{item}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">ฟรี</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-[#131b2e] border border-indigo-100 dark:border-indigo-500/30 space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between font-bold text-slate-800 dark:text-slate-200 gap-1">
                  <span className="line-clamp-1">ห้อง: {room.name}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{formatThaiDate(date)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 text-[11px]">
                  <span>ช่วงเวลา: {selectedSlot}</span>
                  <span>ผู้ใช้งาน: {attendeesCount} คน</span>
                </div>
                {selectedEquipments.length > 0 && (
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 border-t border-indigo-200/50 dark:border-slate-700 pt-1.5">
                    อุปกรณ์เสริม: {selectedEquipments.join(', ')}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  วัตถุประสงค์การใช้งานห้อง *
                </label>
                <textarea 
                  rows="3"
                  value={purpose}
                  onChange={e => { setPurpose(e.target.value); setErrorText(''); }}
                  placeholder="ระบุวัตถุประสงค์ เช่น เพื่อซ้อมนำเสนอโครงงาน Web Application ไฟนอล Lab 15..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {QUICK_PURPOSE_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setPurpose(item); setErrorText(''); sounds.playClick(); }}
                      className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition text-left">
                      + {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={e => { setAgreedTerms(e.target.checked); setErrorText(''); }}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 shrink-0"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    ข้าพเจ้ายินยอมปฏิบัติตามกฎระเบียบการใช้ห้องของมหาวิทยาลัย ดูแลรักษาความสะอาด ปิดไฟและเครื่องปรับอากาศเมื่อสิ้นสุดการใช้งาน และรับผิดชอบความเสียหายของอุปกรณ์
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 4 && confirmedBookingData && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white">ส่งคำขอจองสำเร็จแล้ว!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  รหัสอ้างอิงคำขอ: #{confirmedBookingData.id || Date.now()} (สถานะ: รอการอนุมัติ)
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-3xl border border-indigo-500/30 text-left shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-400">
                      CAMPUS DIGITAL PASS
                    </span>
                    <h4 className="font-black text-sm text-white mt-0.5">{room.name}</h4>
                    <p className="text-[10px] text-slate-300">{room.building}</p>
                  </div>
                  <div className="bg-white p-2 rounded-2xl shadow-md shrink-0 flex items-center justify-center">
                    <PureQRCodeBadge text={`SPACEFLOW-PASS-${confirmedBookingData.id || 'OK'}`} size={64} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-[10px]">
                  <div>
                    <span className="text-slate-400">ผู้ขอจอง:</span>
                    <div className="font-bold text-white">{studentName} ({studentId})</div>
                  </div>
                  <div>
                    <span className="text-slate-400">วันและเวลา:</span>
                    <div className="font-bold text-amber-300">{formatThaiDate(date)} • {selectedSlot}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-2">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => { setStep(s => s - 1); sounds.playClick(); setErrorText(''); }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200">
              ย้อนกลับ
            </button>
          ) : <div />}

          <div className="flex gap-2 ml-auto">
            {step === 1 && (
              <button
                type="button"
                onClick={handleNextStep1}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5">
                <span>ถัดไป: ข้อมูลผู้จอง</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleNextStep2}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5">
                <span>ถัดไป: วัตถุประสงค์</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>ยืนยันส่งคำขอจองห้อง</span>
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition">
                เสร็จสิ้น ปิดหน้าต่าง
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function RoomDetailModal({ isOpen, onClose, room, onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f172a] border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        
        <div className="relative h-48 sm:h-60 bg-slate-900 overflow-hidden shrink-0">
          <img 
            src={room.image} 
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition">
            ✕
          </button>
          
          <div className="absolute bottom-4 left-5 right-5 flex flex-wrap justify-between items-end gap-2">
            <div className="flex-1 min-w-[200px]">
              <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded bg-indigo-600 text-white">
                {room.category}
              </span>
              <h2 className="text-base sm:text-xl font-black text-white mt-1.5 leading-snug">{room.name}</h2>
              <p className="text-xs text-slate-300">{room.building} • {room.floor}</p>
            </div>
            <StatusBadge status={room.status} />
          </div>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 sm:px-6 text-xs font-bold text-slate-600 dark:text-slate-400 overflow-x-auto no-scrollbar shrink-0">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition mr-6 whitespace-nowrap ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black' : 'border-transparent hover:text-slate-800 dark:hover:text-white'}`}>
            ข้อมูลทั่วไป & สเปก
          </button>
          <button 
            onClick={() => setActiveTab('equipment')}
            className={`py-3.5 border-b-2 transition mr-6 whitespace-nowrap ${activeTab === 'equipment' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black' : 'border-transparent hover:text-slate-800 dark:hover:text-white'}`}>
            อุปกรณ์ในห้อง ({room.amenities.length})
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`py-3.5 border-b-2 transition whitespace-nowrap ${activeTab === 'rules' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black' : 'border-transparent hover:text-slate-800 dark:hover:text-white'}`}>
            กฎระเบียบ & คำแนะนำ
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">คำอธิบายพื้นที่</h4>
                <p className="text-slate-600 dark:text-slate-300">{room.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">ความจุสูงสุด</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">{room.capacity} คน</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">ความพึงพอใจ</span>
                  <span className="text-sm font-black text-amber-500">★ {room.rating} / 5</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">การใช้บริการ</span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{room.reviewCount}+ ครั้ง</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">รายการอุปกรณ์ประจำห้อง</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {room.amenities.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">ข้อปฏิบัติในการใช้งาน</h4>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
                <li>ห้ามนำอาหารและเครื่องดื่มมีกลิ่นแรงเข้ามารับประทานภายในห้อง</li>
                <li>กรุณาปิดอุปกรณ์ไฟฟ้า เครื่องปรับอากาศ และจัดเก้าอี้ให้เรียบร้อยหลังสิ้นสุดการใช้งาน</li>
                <li>ห้ามเคลื่อนย้ายอุปกรณ์คอมพิวเตอร์และเครื่องเสียงออกจากตำแหน่งที่กำหนด</li>
                <li>หากมาสายเกินกว่า 30 นาทีจากเวลาที่ระบุ คำขอจองอาจถูกยกเลิกเพื่อให้สิทธิ์แก่นักศึกษาท่านอื่น</li>
              </ul>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-end gap-2.5 shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300">
            ปิด
          </button>
          <button 
            disabled={room.status === 'maintenance'}
            onClick={() => { onClose(); onOpenBooking(room); }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition flex items-center gap-1.5 ${
              room.status === 'maintenance'
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}>
            <Calendar className="w-4 h-4" />
            <span>{room.status === 'maintenance' ? 'ปิดปรับปรุงชั่วคราว' : 'จองห้องนี้ทันที'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

function InteractiveTimetableSchedule({ rooms, bookings, onSelectSlot }) {
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || 1);
  const weekDays = useMemo(() => getNextDays(7), []);
  const [selectedDayIso, setSelectedDayIso] = useState(() => getNextDays(7)[0]?.iso || '');
  const [mobileViewMode, setMobileViewMode] = useState('day'); // 'day' | 'matrix'

  const activeRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const activeDayObj = weekDays.find(d => d.iso === selectedDayIso) || weekDays[0];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xs">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <span>ปฏิทินตารางเวลาสัปดาห์ (Weekly Timetable)</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
            คลิกที่ช่องเวลาเพื่อเปิดแบบฟอร์มจองทันที • ตรวจสอบสถานะความพร้อมได้แบบเรียลไทม์
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" /> ว่าง
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ml-2 shadow-xs" /> จองแล้ว
          </div>

          <div className="flex md:hidden items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
            <button
              onClick={() => { setMobileViewMode('day'); sounds.playClick(); }}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                mobileViewMode === 'day'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}>
              <Smartphone className="w-3 h-3" /> รายวัน
            </button>
            <button
              onClick={() => { setMobileViewMode('matrix'); sounds.playClick(); }}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                mobileViewMode === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}>
              <LayoutGrid className="w-3 h-3" /> ตารางรวม
            </button>
          </div>
        </div>
      </div>

      {/* Room Selector Box */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
            เลือกห้องที่ต้องการดูตารางเวลา:
          </span>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl line-clamp-1">
            ห้องที่เลือก: {activeRoom?.name}
          </span>
        </div>

        <div className="flex overflow-x-auto sm:flex-wrap gap-2 pb-1 sm:pb-0 no-scrollbar">
          {rooms.map(r => {
            const isSelected = selectedRoomId === r.id;
            return (
              <button
                key={r.id}
                onClick={() => { setSelectedRoomId(r.id); sounds.playClick(); }}
                className={`px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-xs whitespace-nowrap shrink-0 ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/40' 
                    : 'bg-slate-100 hover:bg-slate-200/90 dark:bg-[#131d33] dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}>
                <span>{r.category}: {r.name.split(':')[0]}</span>
                <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                  isSelected
                    ? 'bg-indigo-800/80 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                }`}>
                  {r.capacity} คน
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MOBILE SINGLE-DAY VIEW */}
      <div className={`${mobileViewMode === 'day' ? 'block md:hidden' : 'hidden'} space-y-4`}>
        <div className="grid grid-cols-7 gap-1.5 bg-white dark:bg-[#0f172a] p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          {weekDays.map(d => {
            const isDayActive = d.iso === selectedDayIso;
            return (
              <button
                key={d.iso}
                onClick={() => { setSelectedDayIso(d.iso); sounds.playClick(); }}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition ${
                  isDayActive
                    ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/30'
                    : 'bg-slate-50 dark:bg-[#131d33] text-slate-700 dark:text-slate-300 font-bold'
                }`}>
                <span className="text-[11px]">{d.dayName}</span>
                <span className={`text-[10px] mt-0.5 ${isDayActive ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {d.shortDate}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-2.5 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-black text-slate-900 dark:text-white">
              ตารางวัน{activeDayObj?.fullDayName}ที่ {formatThaiDate(activeDayObj?.iso)}
            </span>
            <StatusBadge status={activeRoom?.status} size="sm" />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {OPERATIONAL_SLOTS.map(slot => {
              const bookedItem = bookings.find(b => 
                b.room_id === selectedRoomId && 
                b.date === activeDayObj?.iso && 
                b.time_slot === slot && 
                b.status !== 'rejected'
              );

              return (
                <div 
                  key={slot}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                    bookedItem
                      ? bookedItem.status === 'approved'
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/70'
                        : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/70'
                      : 'bg-slate-50/70 dark:bg-[#131d33]/60 border-slate-200 dark:border-slate-800'
                  }`}>
                  <div>
                    <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                      <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>{slot}</span>
                    </div>
                    {bookedItem ? (
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                        ผู้จอง: {bookedItem.student_name} <span className="opacity-70">(#{bookedItem.id})</span>
                      </div>
                    ) : (
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        สามารถส่งคำขอจองช่วงเวลานี้ได้ทันที
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {bookedItem ? (
                      <StatusBadge status={bookedItem.status} size="sm" />
                    ) : activeRoom?.status === 'maintenance' ? (
                      <span className="text-xs font-bold text-slate-400 px-3 py-1.5 rounded-xl bg-slate-200/70 dark:bg-slate-800">
                        ปิดปรับปรุง
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectSlot(activeRoom, activeDayObj?.iso, slot)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1 transition">
                        <Plus className="w-3.5 h-3.5" /> จองเลย
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DESKTOP & FULL MATRIX TABLE */}
      <div className={`${mobileViewMode === 'matrix' ? 'block' : 'hidden md:block'} bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-center text-xs sm:text-sm border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-[#131d33] border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 text-left font-black text-slate-800 dark:text-slate-200 w-36 border-r border-slate-200 dark:border-slate-800 text-xs sm:text-sm uppercase tracking-wider">
                  ช่วงเวลา / วัน
                </th>
                {weekDays.map(d => (
                  <th key={d.iso} className="p-3.5 font-black text-slate-800 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/70">
                    <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{d.dayName}</div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5">{d.iso.split('-').slice(1).join('/')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {OPERATIONAL_SLOTS.map(slot => (
                <tr key={slot} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3.5 font-black text-left text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#131d33]/50 text-xs sm:text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span>{slot}</span>
                    </div>
                  </td>

                  {weekDays.map(d => {
                    const bookedItem = bookings.find(b => 
                      b.room_id === selectedRoomId && 
                      b.date === d.iso && 
                      b.time_slot === slot && 
                      b.status !== 'rejected'
                    );

                    return (
                      <td key={d.iso} className="p-2 border-r border-slate-200 dark:border-slate-800/70 align-middle">
                        {bookedItem ? (
                          <div className={`p-2.5 sm:p-3 rounded-2xl text-xs border shadow-xs transition-all text-left ${
                            bookedItem.status === 'approved'
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700/80 text-emerald-950 dark:text-emerald-100'
                              : 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-100'
                          }`}>
                            <div className="truncate font-black text-xs sm:text-sm">
                              {bookedItem.student_name}
                            </div>
                            <div className="flex items-center justify-between mt-1 text-[11px] font-bold">
                              <span className="opacity-75">#{bookedItem.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black whitespace-nowrap ${
                                bookedItem.status === 'approved'
                                  ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100'
                                  : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                              }`}>
                                {bookedItem.status === 'approved' ? 'อนุมัติแล้ว' : 'รอตรวจสอบ'}
                              </span>
                            </div>
                          </div>
                        ) : activeRoom?.status === 'maintenance' ? (
                          <div className="p-3 rounded-2xl text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 font-bold text-center">
                            ปิดปรับปรุง
                          </div>
                        ) : (
                          <button
                            onClick={() => onSelectSlot(activeRoom, d.iso, slot)}
                            className="w-full min-h-[58px] p-2.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-600 dark:border-slate-700/80 dark:hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50 dark:bg-[#11192e]/40 dark:hover:bg-indigo-950/50 text-slate-700 hover:text-indigo-700 dark:text-slate-300 dark:hover:text-indigo-300 transition-all flex flex-col items-center justify-center gap-0.5 group shadow-xs">
                            <span className="text-xs sm:text-sm font-extrabold flex items-center gap-1 text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              <Plus className="w-3.5 h-3.5" /> ว่าง
                            </span>
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 opacity-90 group-hover:opacity-100">
                              กดเพื่อจอง
                            </span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsDashboard({ rooms, bookings }) {
  const stats = useMemo(() => {
    const total = bookings.length;
    const approved = bookings.filter(b => b.status === 'approved').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const rejected = bookings.filter(b => b.status === 'rejected').length;

    const roomCounts = rooms.map(r => ({
      name: r.name.split(':')[0],
      count: bookings.filter(b => b.room_id === r.id).length
    }));

    const slotCounts = OPERATIONAL_SLOTS.map(slot => ({
      slot: slot.split(' - ')[0],
      count: bookings.filter(b => b.time_slot === slot).length
    }));

    return { total, approved, pending, rejected, roomCounts, slotCounts };
  }, [rooms, bookings]);

  const maxSlotCount = Math.max(...stats.slotCounts.map(s => s.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>รายงานและสถิติภาพรวมระบบ (Analytics Suite)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">วิเคราะห์แนวโน้มการจองพื้นที่และช่วงเวลายอดนิยม</p>
        </div>
        <button
          onClick={() => { sounds.playSuccess(); exportBookingsToCSV(bookings); }}
          className="w-full sm:w-auto justify-center flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition">
          <Download className="w-4 h-4" /> ส่งออกข้อมูลเป็น CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> ช่วงเวลายอดนิยม (Peak Hours)
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">อิงจากคำขอทั้งหมด</span>
          </div>

          <div className="space-y-3 pt-2">
            {stats.slotCounts.map(({ slot, count }) => {
              const pct = Math.round((count / maxSlotCount) * 100);
              return (
                <div key={slot} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{slot} น.</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{count} คำขอ ({pct}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-500" /> สัดส่วนสถานะคำขอ (Approval Ratio)
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">รวม {stats.total} รายการ</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">{stats.approved}</span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mt-1">อนุมัติแล้ว</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400">{stats.pending}</span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mt-1">รอการอนุมัติ</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <span className="text-xl sm:text-2xl font-black text-rose-700 dark:text-rose-400">{stats.rejected}</span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mt-1">ปฏิเสธ</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            💡 <strong>Insight:</strong> ช่วงเวลาที่มีการใช้งานหนาแน่นที่สุดคือ 13:00 - 15:00 น. ควรเพิ่มการบำรุงรักษาอุปกรณ์ก่อนช่วงเวลาดังกล่าว
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandPaletteModal({ isOpen, onClose, onNavigate, rooms }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickNav = [
    { label: 'ไปยังหน้าสำรวจห้องทั้งหมด', action: () => onNavigate('explore') },
    { label: 'ไปยังปฏิทินตารางเวลาสัปดาห์ (Timetable)', action: () => onNavigate('timetable') },
    { label: 'ไปยังประวัติการจองของฉัน (My Bookings)', action: () => onNavigate('my-bookings') },
    { label: 'ไปยังรายงานและสถิติ (Analytics)', action: () => onNavigate('analytics') }
  ];

  const matchedRooms = rooms.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.building.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-20 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ค้นหาหน้า, ค้นหาห้อง, หรือพิมพ์คำสั่ง..."
            className="w-full bg-transparent text-slate-900 dark:text-white font-bold text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 font-mono">
            ESC
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1 custom-scrollbar">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400">การนำทางด่วน</div>
          {quickNav.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.action(); onClose(); sounds.playClick(); }}
              className="w-full p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-left font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between transition">
              <span>{item.label}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
            </button>
          ))}

          {matchedRooms.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 mt-2">ห้องที่ตรงกับการค้นหา</div>
              {matchedRooms.map(r => (
                <button
                  key={r.id}
                  onClick={() => { onNavigate('explore'); onClose(); sounds.playClick(); }}
                  className="w-full p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2 transition">
                  <span className="font-bold truncate">{r.name} ({r.building})</span>
                  <span className="text-[10px] text-indigo-500 font-bold shrink-0">{r.category}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [currentUser, setCurrentUser] = useState({
    role: 'student',
    student_id: '68042380112',
    name: 'ธนพัฒน์ ป้อมเย็น'
  });

  const [activeTab, setActiveTab] = useState('explore'); 
  const [rooms, setRooms] = useState(INITIAL_ROOMS_CATALOG);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS_CATALOG);
  const [backendConnected, setBackendConnected] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [minCapacityFilter, setMinCapacityFilter] = useState(0);
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState('ALL');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');

  const [inspectRoom, setInspectRoom] = useState(null);
  const [wizardRoom, setWizardRoom] = useState(null);
  const [wizardInitialDate, setWizardInitialDate] = useState('');
  const [wizardInitialSlot, setWizardInitialSlot] = useState('');
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'ยืนยัน',
    isDanger: false,
    onConfirm: () => {}
  });

  const [rejectPrompt, setRejectPrompt] = useState({
    isOpen: false,
    bookingId: null,
    reason: ''
  });

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', title = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    sounds.muted = !soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const syncWithBackend = useCallback(async () => {
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE}/rooms`).catch(() => null),
        fetch(`${API_BASE}/bookings`).catch(() => null)
      ]);

      if (roomsRes && roomsRes.ok) {
        const rData = await roomsRes.json();
        if (rData.success && rData.data.length > 0) {
          setRooms(rData.data.map(item => {
            const seed = INITIAL_ROOMS_CATALOG.find(s => s.id === item.id) || {};
            return { 
              ...seed, 
              ...item, 
              amenities: seed.amenities || ['Wi-Fi 6', 'เครื่องปรับอากาศ'], 
              image: seed.image || INITIAL_ROOMS_CATALOG[0].image 
            };
          }));
          setBackendConnected(true);
        }
      }

      if (bookingsRes && bookingsRes.ok) {
        const bData = await bookingsRes.json();
        if (bData.success) {
          const normalizedBookings = bData.data.map(b => ({
            ...b,
            room_id: Number(b.room_id),
            date: normalizeDateOnly(b.date || b.booking_date),
            attendees_count: Number(b.attendees_count || 2),
            extra_items: normalizeExtraItems(b.extra_items),
            admin_notes: b.admin_notes || ''
          }));
          setBookings(normalizedBookings);
          setBackendConnected(true);
        }
      }
    } catch {
      setBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  const handleBookingSubmit = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        addToast(data.message || 'ส่งคำขอจองสำเร็จแล้ว', 'success', 'จองพื้นที่สำเร็จ');
        syncWithBackend();
        return { success: true, data: data.data };
      } else {
        const err = await res.json();
        return { success: false, message: err.message || 'ส่งคำขอจองไม่สำเร็จ' };
      }
    } catch {
      const hasConflict = bookings.some(b => 
        b.room_id === payload.room_id && 
        b.date === payload.date && 
        b.time_slot === payload.time_slot && 
        b.status !== 'rejected'
      );

      if (hasConflict) {
        return { success: false, message: 'ขออภัย ช่วงวันและเวลาดังกล่าวมีผู้จองแล้ว!' };
      }

      const newBooking = {
        id: Date.now(),
        ...payload,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setBookings(prev => [newBooking, ...prev]);
      addToast('บันทึกคำขอเรียบร้อยแล้ว', 'success', 'ส่งคำขอสำเร็จ');
      return { success: true, data: newBooking };
    }
  };

  const handleStatusUpdate = async (id, status, notes = '') => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: notes })
      });

      if (res.ok) {
        addToast(`อัปเดตสถานะเป็น "${status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}" สำเร็จ`, 'success');
        syncWithBackend();
      } else {
        throw new Error('API Error');
      }
    } catch {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status, admin_notes: notes } : b));
      addToast(`อัปเดตสถานะเป็น "${status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}" เรียบร้อย`, 'success');
    }
  };

  const handleDeleteBooking = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ยืนยันการลบหรือยกเลิกคำขอ?',
      message: 'คุณต้องการลบรายการจองนี้ออกจากระบบใช่หรือไม่? ข้อมูลจะไม่สามารถกู้คืนได้',
      confirmText: 'ลบรายการ',
      isDanger: true,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        sounds.playClick();
        try {
          await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
        } catch {
          // Ignored
        }
        setBookings(prev => prev.filter(b => b.id !== id));
        addToast('ลบรายการจองสำเร็จเรียบร้อย', 'info');
      }
    });
  };

  const handleToggleRoomMaintenance = async (roomId) => {
    sounds.playClick();
    try {
      await fetch(`${API_BASE}/rooms/${roomId}/toggle-status`, { method: 'PUT' });
      syncWithBackend();
    } catch {
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: r.status === 'active' ? 'maintenance' : 'active' } : r));
    }
    addToast('เปลี่ยนสถานะการเปิดให้บริการห้องเรียบร้อย', 'info');
  };

  const statsOverview = useMemo(() => {
    const totalRooms = rooms.length;
    const activeRooms = rooms.filter(r => r.status === 'active').length;
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const approvedBookings = bookings.filter(b => b.status === 'approved').length;
    const myBookingsCount = bookings.filter(b => b.student_id === currentUser.student_id).length;
    return { totalRooms, activeRooms, totalBookings, pendingBookings, approvedBookings, myBookingsCount };
  }, [rooms, bookings, currentUser.student_id]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchSearch = room.name.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                          room.building.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchCategory = selectedCategory === 'ALL' || room.category === selectedCategory;
      const matchCapacity = room.capacity >= minCapacityFilter;
      const matchBuilding = selectedBuildingFilter === 'ALL' || room.building.includes(selectedBuildingFilter);
      return matchSearch && matchCategory && matchCapacity && matchBuilding;
    });
  }, [rooms, searchKeyword, selectedCategory, minCapacityFilter, selectedBuildingFilter]);

  const categoriesList = ['ALL', 'Studio', 'Meeting', 'Esports', 'Focus Pod', 'Workshop'];
  const buildingsList = ['ALL', 'อาคาร 4', 'อาคารวิทยบริการ', 'ศูนย์คอมพิวเตอร์', 'หอสมุดกลาง', 'อาคารเฉลิมพระเกียรติ'];

  return (
    <div className={`min-h-screen pb-20 md:pb-0 transition-colors duration-300 font-sans ${darkMode ? 'bg-[#080c14] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-[#0b0f1a] border-b border-slate-800 text-slate-200 px-3 sm:px-4 py-2 text-xs sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-2 py-0.5 rounded-lg text-[10px] tracking-wider uppercase shadow-sm whitespace-nowrap shrink-0">
              FINAL DEMO A+
            </span>
            <span className="text-slate-300 hidden lg:inline font-medium whitespace-nowrap">
              สลับบทบาทการนำเสนอสด:
            </span>
            
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentUser({ role: 'student', student_id: '68042380112', name: 'ธนพัฒน์ ป้อมเย็น' });
                addToast('สลับบทบาท: ธนพัฒน์ ป้อมเย็น (นักศึกษา)', 'info');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                currentUser.role === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-1 ring-indigo-400/50'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}>
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>ธนพัฒน์ (นักศึกษา)</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setCurrentUser({ role: 'admin', student_id: 'ADMIN01', name: 'ผศ.ดร.สมเกียรติ (ผู้ดูแล)' });
                addToast('สลับบทบาท: ผู้ดูแลระบบ (Admin Suite)', 'info');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                currentUser.role === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40 ring-1 ring-emerald-400/50'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}>
              <Shield className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>ผศ.ดร.สมเกียรติ (Admin)</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsCmdOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition text-[11px] font-medium border border-slate-700/60"
              title="ค้นหาด่วน (Ctrl+K)">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">ค้นหาด่วน</span>
              <kbd className="hidden md:inline px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono">
                Ctrl+K
              </kbd>
            </button>

            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                sounds.playClick();
              }}
              title="เปิด/ปิดเสียงเอฟเฟกต์"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition border border-slate-700/60">
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            <button 
              onClick={() => {
                setDarkMode(!darkMode);
                sounds.playClick();
              }}
              title="สลับโหมดสีสว่าง/มืด"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 transition border border-slate-700/60">
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-300" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className={`border-b sticky top-[45px] z-40 backdrop-blur-xl transition-colors ${
        darkMode ? 'bg-[#0e1424]/95 border-slate-800/80' : 'bg-white/95 border-slate-200 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-3 lg:py-0 lg:h-20 gap-3">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                    Space<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
                  </h1>
                  <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-extrabold border bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30 whitespace-nowrap shrink-0">
                    Campus Space Booking
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                  ระบบบริหารและจองพื้นที่อัจฉริยะ (Lab 15 Final) • โดย ธนพัฒน์ ป้อมเย็น
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 rounded-2xl border ${
              darkMode ? 'bg-[#111827] border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => { setActiveTab('explore'); sounds.playClick(); }}
                className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'explore'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}>
                <Compass className="w-4 h-4 shrink-0" />
                <span>สำรวจห้อง ({rooms.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('timetable'); sounds.playClick(); }}
                className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'timetable'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}>
                <Calendar className="w-4 h-4 shrink-0" />
                <span>ตารางเวลาสัปดาห์</span>
              </button>

              <button
                onClick={() => { setActiveTab('my-bookings'); sounds.playClick(); }}
                className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'my-bookings'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>การจองของฉัน</span>
                <span className="px-1.5 py-0.2 rounded-full text-xs font-black bg-indigo-700 text-white">
                  {statsOverview.myBookingsCount}
                </span>
              </button>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => { setActiveTab('admin'); sounds.playClick(); }}
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    activeTab === 'admin'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-800'
                  }`}>
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>แผงควบคุมแอดมิน</span>
                  {statsOverview.pendingBookings > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-xs bg-amber-500 text-slate-950 font-black animate-pulse">
                      {statsOverview.pendingBookings}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => { setActiveTab('analytics'); sounds.playClick(); }}
                className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}>
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>สถิติ</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className={`p-3.5 sm:p-5 rounded-3xl border shadow-sm transition flex items-center justify-between gap-2 ${
            darkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 truncate">พื้นที่ทั้งหมด</p>
              <h3 className="text-xl sm:text-3xl font-black mt-0.5 sm:mt-1 text-slate-900 dark:text-white whitespace-nowrap">{statsOverview.totalRooms} ห้อง</h3>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">สตูดิโอ & ห้องประชุม</p>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:border-indigo-500/30 dark:text-indigo-400 shrink-0">
              <Building2 className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
          </div>

          <div className={`p-3.5 sm:p-5 rounded-3xl border shadow-sm transition flex items-center justify-between gap-2 ${
            darkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 truncate">พร้อมใช้งาน</p>
              <h3 className="text-xl sm:text-3xl font-black mt-0.5 sm:mt-1 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{statsOverview.activeRooms} ห้อง</h3>
              <p className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400/90 mt-0.5 sm:mt-1 truncate">เปิดรับคำขอจองทันที</p>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
          </div>

          <div className={`p-3.5 sm:p-5 rounded-3xl border shadow-sm transition flex items-center justify-between gap-2 ${
            darkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 truncate">รอการอนุมัติ</p>
              <h3 className="text-xl sm:text-3xl font-black mt-0.5 sm:mt-1 text-amber-600 dark:text-amber-400 whitespace-nowrap">{statsOverview.pendingBookings} รายการ</h3>
              <p className="text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-400/90 mt-0.5 sm:mt-1 truncate">รอผู้ดูแลตรวจสอบ</p>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 dark:bg-amber-500/15 dark:border-amber-500/30 dark:text-amber-400 shrink-0">
              <Clock className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
          </div>

          <div className={`p-3.5 sm:p-5 rounded-3xl border shadow-sm transition flex items-center justify-between gap-2 ${
            darkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-purple-800 dark:text-purple-400 truncate">อนุมัติเรียบร้อย</p>
              <h3 className="text-xl sm:text-3xl font-black mt-0.5 sm:mt-1 text-purple-600 dark:text-purple-400 whitespace-nowrap">{statsOverview.approvedBookings} รายการ</h3>
              <p className="text-[10px] sm:text-xs font-bold text-purple-700 dark:text-purple-400/90 mt-0.5 sm:mt-1 truncate">ยืนยันสิทธิ์สำเร็จ</p>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 dark:bg-purple-500/15 dark:border-purple-500/30 dark:text-purple-400 shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
          </div>
        </div>

        {}
        {activeTab === 'explore' && (
          <div className="space-y-5 sm:space-y-6">
            <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm space-y-4 ${
              darkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3.5">
                <div className="relative w-full md:w-96 shrink-0">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="ค้นหาชื่อห้อง, สตูดิโอ, หรืออาคาร..."
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-0.5">
                  {categoriesList.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); sounds.playClick(); }}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition whitespace-nowrap shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}>
                      {cat === 'ALL' ? '✨ ทั้งหมด' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">อาคาร:</span>
                  <select 
                    value={selectedBuildingFilter}
                    onChange={e => setSelectedBuildingFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                    {buildingsList.map(b => (
                      <option key={b} value={b}>{b === 'ALL' ? 'ทุกอาคาร' : b}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">ความจุขั้นต่ำ:</span>
                  <select 
                    value={minCapacityFilter}
                    onChange={e => setMinCapacityFilter(Number(e.target.value))}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none">
                    <option value={0}>ทั้งหมด</option>
                    <option value={4}>4 คนขึ้นไป</option>
                    <option value={8}>8 คนขึ้นไป</option>
                    <option value={12}>12 คนขึ้นไป</option>
                  </select>
                </div>

                <span className="col-span-2 sm:col-span-1 sm:ml-auto text-right text-xs font-bold text-slate-600 dark:text-slate-400">
                  แสดง {filteredRooms.length} จาก {rooms.length} ห้อง
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredRooms.map(room => (
                <div 
                  key={room.id}
                  className={`group rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-2xl sm:hover:-translate-y-1.5 flex flex-col justify-between ${
                    darkMode ? 'bg-[#0f172a]/90 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}>
                  
                  <div>
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                      <img 
                        src={room.image} 
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                      
                      <div className="absolute top-3.5 right-3.5">
                        <StatusBadge status={room.status} />
                      </div>

                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-xl bg-indigo-600 text-white backdrop-blur-md shadow-md">
                          {room.category}
                        </span>
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-black/60 text-amber-300 backdrop-blur-sm">
                          ★ {room.rating}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-4">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1 leading-snug">
                          {room.name}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" /> {room.building}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" /> สูงสุด {room.capacity} คน
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-300 block mb-1.5">⚡ สิ่งอำนวยความสะดวก:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {room.amenities.slice(0, 3).map((a, idx) => (
                            <span 
                              key={idx}
                              className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                              {a}
                            </span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              +{room.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {room.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0 space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setInspectRoom(room); sounds.playClick(); }}
                        className="flex-1 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition">
                        ดูสเปกเต็ม
                      </button>

                      <button
                        disabled={room.status === 'maintenance'}
                        onClick={() => { 
                          setWizardRoom(room); 
                          setWizardInitialDate(new Date().toISOString().split('T')[0]); 
                          setWizardInitialSlot('');
                          sounds.playClick(); 
                        }}
                        className={`flex-1 py-2.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1 text-white shadow-lg ${
                          room.status === 'maintenance'
                            ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/25'
                        }`}>
                        <span>{room.status === 'maintenance' ? 'ปิดปรับปรุง' : 'จองห้องนี้'}</span>
                        {room.status === 'active' && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => handleToggleRoomMaintenance(room.id)}
                        className="w-full py-2 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition">
                        {room.status === 'active' ? '🔴 สั่งปิดปรับปรุงห้อง (Admin)' : '🟢 เปิดให้บริการ (Admin)'}
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {activeTab === 'timetable' && (
          <InteractiveTimetableSchedule 
            rooms={rooms}
            bookings={bookings}
            onSelectSlot={(room, date, slot) => {
              setWizardRoom(room);
              setWizardInitialDate(date);
              setWizardInitialSlot(slot);
              sounds.playClick();
            }}
          />
        )}

        {activeTab === 'my-bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  ประวัติการจองพื้นที่ของฉัน ({currentUser.name})
                </h2>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                  รหัสนักศึกษา: {currentUser.student_id} • ตรวจสอบสถานะและจัดการคำขอจอง
                </p>
              </div>
              <button
                onClick={() => { setActiveTab('explore'); sounds.playClick(); }}
                className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> ส่งคำขอจองห้องใหม่
              </button>
            </div>

            <div className={`rounded-3xl border overflow-hidden shadow-sm ${
              darkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {bookings.filter(b => b.student_id === currentUser.student_id).length === 0 ? (
                <div className="text-center py-20 text-slate-400 space-y-3">
                  <Calendar className="w-12 h-12 mx-auto opacity-30 text-indigo-500" />
                  <p className="text-sm font-semibold">ยังไม่มีรายการจองในระบบ</p>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-xs min-w-[680px]">
                    <thead className={`border-b font-bold uppercase tracking-wider text-[11px] ${
                      darkMode ? 'bg-slate-800/50 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      <tr>
                        <th className="p-4">ห้องที่จอง</th>
                        <th className="p-4">วัน / ช่วงเวลา</th>
                        <th className="p-4">วัตถุประสงค์</th>
                        <th className="p-4">อุปกรณ์เสริม</th>
                        <th className="p-4 text-center">สถานะ</th>
                        <th className="p-4 text-right">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                      {bookings.filter(b => b.student_id === currentUser.student_id).map(b => (
                        <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">
                            <div>{b.room_name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">คำขอ #{b.id}</div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="font-bold text-slate-800 dark:text-slate-300">{formatThaiDate(b.date)}</div>
                            <div className="text-indigo-600 dark:text-indigo-400 font-semibold">{b.time_slot}</div>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">{b.purpose}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">
                            {b.extra_items && b.extra_items.length > 0 ? b.extra_items.join(', ') : '-'}
                          </td>
                          <td className="p-4 text-center">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 text-[11px] font-bold transition">
                              ยกเลิกคำขอ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {currentUser.role === 'admin' && activeTab === 'admin' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>แผงควบคุมและอนุมัติคำขอ (Admin Suite)</span>
                </h2>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                  สิทธิ์ผู้ดูแลระบบ: ตรวจสอบและอนุมัติหรือปฏิเสธคำขอจองห้องแบบเรียลไทม์
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold overflow-x-auto no-scrollbar w-full sm:w-auto">
                {['ALL', 'pending', 'approved', 'rejected'].map(st => (
                  <button
                    key={st}
                    onClick={() => { setBookingStatusFilter(st); sounds.playClick(); }}
                    className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap shrink-0 ${
                      bookingStatusFilter === st
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                    {st === 'ALL' ? 'ทั้งหมด' : st === 'pending' ? 'รออนุมัติ' : st === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-3xl border overflow-hidden shadow-sm ${
              darkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs min-w-[720px]">
                  <thead className={`border-b font-bold uppercase tracking-wider text-[11px] ${
                    darkMode ? 'bg-slate-800/50 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    <tr>
                      <th className="p-4">ห้องที่ขอจอง</th>
                      <th className="p-4">นักศึกษาผู้ขอจอง</th>
                      <th className="p-4">วัน / ช่วงเวลา</th>
                      <th className="p-4">วัตถุประสงค์</th>
                      <th className="p-4 text-center">สถานะ</th>
                      <th className="p-4 text-right">การตัดสินใจ</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {bookings
                      .filter(b => bookingStatusFilter === 'ALL' || b.status === bookingStatusFilter)
                      .map(b => (
                        <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">
                            <div>{b.room_name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">คำขอ #{b.id}</div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="font-bold text-slate-800 dark:text-slate-300">{b.student_name}</div>
                            <div className="text-slate-500 dark:text-slate-400">{b.student_id}</div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="font-bold text-slate-800 dark:text-slate-300">{formatThaiDate(b.date)}</div>
                            <div className="text-indigo-600 dark:text-indigo-400 font-semibold">{b.time_slot}</div>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                            {b.purpose}
                            {b.admin_notes && (
                              <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">หมายเหตุ: {b.admin_notes}</div>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => {
                                      sounds.playSuccess();
                                      handleStatusUpdate(b.id, 'approved', 'อนุมัติเรียบร้อยโดยแอดมิน');
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition flex items-center gap-1">
                                    <Check className="w-3 h-3" /> อนุมัติ
                                  </button>
                                  <button
                                    onClick={() => {
                                      sounds.playClick();
                                      setRejectPrompt({ isOpen: true, bookingId: b.id, reason: '' });
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-sm transition flex items-center gap-1">
                                    <XCircle className="w-3 h-3" /> ปฏิเสธ
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                                title="ลบรายการ">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard rooms={rooms} bookings={bookings} />
        )}

      </main>

      {}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-2 py-1.5 flex justify-around items-center ${
        darkMode ? 'bg-[#0b0f1a]/95 border-slate-800 text-slate-400' : 'bg-white/95 border-slate-200 text-slate-600 shadow-lg'
      }`}>
        <button
          onClick={() => { setActiveTab('explore'); sounds.playClick(); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            activeTab === 'explore' ? 'text-indigo-500 font-black' : 'font-semibold'
          }`}>
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">สำรวจห้อง</span>
        </button>

        <button
          onClick={() => { setActiveTab('timetable'); sounds.playClick(); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            activeTab === 'timetable' ? 'text-indigo-500 font-black' : 'font-semibold'
          }`}>
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">ตารางเวลา</span>
        </button>

        <button
          onClick={() => { setActiveTab('my-bookings'); sounds.playClick(); }}
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            activeTab === 'my-bookings' ? 'text-indigo-500 font-black' : 'font-semibold'
          }`}>
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-[10px]">การจอง ({statsOverview.myBookingsCount})</span>
        </button>

        {currentUser.role === 'admin' ? (
          <button
            onClick={() => { setActiveTab('admin'); sounds.playClick(); }}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
              activeTab === 'admin' ? 'text-emerald-500 font-black' : 'font-semibold'
            }`}>
            <Shield className="w-5 h-5" />
            <span className="text-[10px]">แอดมิน</span>
            {statsOverview.pendingBookings > 0 && (
              <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>
        ) : (
          <button
            onClick={() => { setActiveTab('analytics'); sounds.playClick(); }}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
              activeTab === 'analytics' ? 'text-indigo-500 font-black' : 'font-semibold'
            }`}>
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px]">สถิติ</span>
          </button>
        )}
      </nav>

      <footer className={`border-t py-8 text-center text-xs mt-12 transition-colors ${
        darkMode ? 'bg-[#0b0f1a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-800 dark:text-slate-300">
            SpaceFlow: Smart Campus Studio & Space Booking (Ultra-Modern Edition)
          </p>
          <p className="text-[11px]">
            โครงงานปลายภาครายวิชา 4123307 การพัฒนาเว็บแอปพลิเคชัน (Lab 15) • พัฒนาโดย นายธนพัฒน์ ป้อมเย็น (68042380112)
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] text-slate-500 pt-1">
            <span>สถานะระบบ: {backendConnected ? '🟢 เชื่อมต่อ Express/MySQL สำเร็จ' : '🟡 โหมด Local Simulator'}</span>
            <span>•</span>
            <span>React + Vite + Tailwind CSS</span>
          </div>
        </div>
      </footer>

      <RoomDetailModal 
        isOpen={Boolean(inspectRoom)}
        onClose={() => setInspectRoom(null)}
        room={inspectRoom}
        onOpenBooking={(room) => {
          setWizardRoom(room);
          setWizardInitialDate(new Date().toISOString().split('T')[0]);
          setWizardInitialSlot('');
        }}
      />

      <BookingWizardModal 
        isOpen={Boolean(wizardRoom)}
        onClose={() => setWizardRoom(null)}
        room={wizardRoom}
        initialDate={wizardInitialDate}
        initialSlot={wizardInitialSlot}
        bookings={bookings}
        onSubmitBooking={handleBookingSubmit}
      />

      <CommandPaletteModal
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        rooms={rooms}
      />

      <CustomConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        isDanger={confirmDialog.isDanger}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />

      {rejectPrompt.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-black text-base text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> ระบุเหตุผลในการปฏิเสธคำขอ
            </h3>
            <textarea 
              rows="3"
              placeholder="เช่น ห้องปิดปรับปรุงกะทันหัน หรืออุปกรณ์ไม่พร้อมให้บริการ..."
              value={rejectPrompt.reason}
              onChange={e => setRejectPrompt(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 dark:text-slate-100"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setRejectPrompt({ isOpen: false, bookingId: null, reason: '' })}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300">
                ยกเลิก
              </button>
              <button 
                onClick={() => {
                  sounds.playError();
                  handleStatusUpdate(rejectPrompt.bookingId, 'rejected', rejectPrompt.reason || 'ไม่อนุมัติโดยแอดมิน');
                  setRejectPrompt({ isOpen: false, bookingId: null, reason: '' });
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition">
                ยืนยันการปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastNotificationCenter toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}