import { Link } from "react-router"

function HomePage() {
  return (
    <section className="hero-page">
      <div className="hero-content">
        <p className="eyebrow">4123307 Web Application Development</p>
        <h1>ระบบแสดงข้อมูลรายวิชาแบบหลายหน้า</h1>
        <p>
          เรียนรู้การจัดการเส้นทางใน React Application ด้วย React Router
          เพื่อสร้างเว็บแอปพลิเคชันแบบ Single Page Application
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/courses">
            ดูรายวิชาทั้งหมด
          </Link>
          <Link className="secondary-button" to="/about">
            เกี่ยวกับรายวิชา
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomePage