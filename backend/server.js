import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

pool.getConnection()
  .then(conn => {
    console.log('✅ เชื่อมต่อฐานข้อมูล MySQL (campus_space_booking) สำเร็จเรียบร้อย!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ ไม่สามารถเชื่อมต่อ MySQL ได้:', err.message);
  });

// 1. GET /api/stats
app.get('/api/stats', async (req, res) => {
  try {
    const [[roomCount]] = await pool.query('SELECT COUNT(*) as total FROM rooms');
    const [[activeCount]] = await pool.query("SELECT COUNT(*) as total FROM rooms WHERE status = 'active'");
    const [[bookingCount]] = await pool.query('SELECT COUNT(*) as total FROM bookings');
    const [[pendingCount]] = await pool.query("SELECT COUNT(*) as total FROM bookings WHERE status = 'pending'");
    const [[approvedCount]] = await pool.query("SELECT COUNT(*) as total FROM bookings WHERE status = 'approved'");

    res.json({
      success: true,
      data: {
        totalRooms: roomCount.total || 0,
        activeRooms: activeCount.total || 0,
        totalBookings: bookingCount.total || 0,
        pendingBookings: pendingCount.total || 0,
        approvedBookings: approvedCount.total || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. GET /api/rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ดึงข้อมูลห้องไม่สำเร็จ: ' + err.message });
  }
});

// 3. PUT /api/rooms/:id/toggle-status
app.put('/api/rooms/:id/toggle-status', async (req, res) => {
  const roomId = Number(req.params.id);
  try {
    const [rows] = await pool.query('SELECT status FROM rooms WHERE id = ?', [roomId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลห้องนี้' });

    const newStatus = rows[0].status === 'active' ? 'maintenance' : 'active';
    await pool.query('UPDATE rooms SET status = ? WHERE id = ?', [newStatus, roomId]);
    res.json({ success: true, message: 'อัปเดตสถานะห้องสำเร็จ', status: newStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. GET /api/bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const sql = `
      SELECT b.*, r.name AS room_name, r.building 
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      ORDER BY b.id DESC
    `;
    const [rows] = await pool.query(sql);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ดึงข้อมูลการจองไม่สำเร็จ: ' + err.message });
  }
});

// 5. POST /api/bookings (พร้อมระบบป้องกันเวลาชนกัน 409 Conflict)
app.post('/api/bookings', async (req, res) => {
  const { room_id, student_id, student_name, date, time_slot, purpose, attendees_count, extra_items } = req.body;

  if (!room_id || !student_id || !student_name || !date || !time_slot) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลการจองให้ครบถ้วน' });
  }

  try {
    const [existing] = await pool.query(
      `SELECT id FROM bookings 
       WHERE room_id = ? AND date = ? AND time_slot = ? AND status != 'rejected'`,
      [room_id, date, time_slot]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'ขออภัย ช่วงวันและเวลาดังกล่าวมีผู้จองห้องนี้แล้ว!'
      });
    }

    const extraJson = Array.isArray(extra_items) ? JSON.stringify(extra_items) : (extra_items || '[]');

    const [result] = await pool.query(
      `INSERT INTO bookings (room_id, student_id, student_name, date, time_slot, purpose, attendees_count, extra_items, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [room_id, student_id, student_name, date, time_slot, purpose || '-', Number(attendees_count || 2), extraJson]
    );

    res.status(201).json({
      success: true,
      message: 'ส่งคำขอจองห้องสำเร็จ (รอการอนุมัติ)',
      data: {
        id: result.insertId,
        room_id: Number(room_id),
        student_id,
        student_name,
        date,
        time_slot,
        purpose,
        attendees_count: Number(attendees_count || 2),
        extra_items: extra_items || [],
        status: 'pending'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'บันทึกการจองไม่สำเร็จ: ' + err.message });
  }
});

// 6. PUT /api/bookings/:id/status
app.put('/api/bookings/:id/status', async (req, res) => {
  const bookingId = Number(req.params.id);
  const { status, admin_notes } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE bookings SET status = ?, admin_notes = ? WHERE id = ?',
      [status, admin_notes || '', bookingId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'ไม่พบรายการจองนี้' });
    res.json({ success: true, message: `อัปเดตสถานะเป็น ${status} สำเร็จ` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. DELETE /api/bookings/:id
app.delete('/api/bookings/:id', async (req, res) => {
  const bookingId = Number(req.params.id);
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [bookingId]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'ไม่พบรายการจองนี้' });
    res.json({ success: true, message: 'ลบรายการจองสำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`🚀 SpaceFlow Backend Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} ชน! กรุณารันคำสั่ง taskkill /F /IM node.exe`);
  }
});