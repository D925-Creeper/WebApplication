import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="hero">
        <h1>เริ่มต้นพัฒนาเว็บด้วย React และ Vite</h1>
        <p>รายวิชา 4123307 การพัฒนาเว็บแอปพลิเคชัน</p>
      </header>

      <main className="content">
        <section className="card">
          <h2>ข้อมูลรายวิชา</h2>
          <p><strong>รหัสวิชา:</strong> 4123307</p>
          <p><strong>ชื่อวิชา:</strong> การพัฒนาเว็บแอปพลิเคชัน</p>
          <p><strong>ชื่อภาษาอังกฤษ:</strong> Web Application Development</p>
          <p><strong>หน่วยกิต:</strong> 3(2-2-5)</p>
        </section>

        <section className="card">
          <h2>เครื่องมือที่ใช้</h2>
          <ul>
            <li>Node.js</li>
            <li>npm</li>
            <li>Vite</li>
            <li>React</li>
            <li>Visual Studio Code</li>
          </ul>
        </section>

        <section className="card">
          <h2>ผลลัพธ์ที่คาดหวัง</h2>
          <p>
            นักศึกษาสามารถสร้าง รัน และแก้ไขโปรเจกต์ React เบื้องต้นได้
            พร้อมเข้าใจโครงสร้างไฟล์ของโปรเจกต์
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
