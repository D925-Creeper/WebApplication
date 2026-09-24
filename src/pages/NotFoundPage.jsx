import { Link } from "react-router"

function NotFoundPage() {
  return (
    <section className="page-section">
      <div className="not-found-box">
        <h1>404</h1>
        <h2>ไม่พบหน้าที่ต้องการ</h2>
        <p>
          เส้นทางที่คุณเปิดไม่มีอยู่ในระบบ กรุณากลับไปยังหน้าแรกหรือหน้ารายวิชา
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/">
            กลับหน้าแรก
          </Link>
          <Link className="secondary-button" to="/courses">
            ดูรายวิชา
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage