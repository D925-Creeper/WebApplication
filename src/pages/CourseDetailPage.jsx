import { Link, useNavigate, useParams } from "react-router"
import { courses } from "../data/courses"

function CourseDetailPage() {
  const { courseCode } = useParams()
  const navigate = useNavigate()
  const course = courses.find((item) => item.code === courseCode)

  if (!course) {
    return (
      <section className="page-section">
        <div className="not-found-box">
          <h1>ไม่พบข้อมูลรายวิชา</h1>
          <p>ไม่พบรายวิชารหัส {courseCode} ในระบบ</p>
          <Link className="primary-button" to="/courses">
            กลับไปหน้ารายวิชา
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page-section">
      <nav className="breadcrumb">
        <Link to="/">หน้าแรก</Link>
        <span>/</span>
        <Link to="/courses">รายวิชา</Link>
        <span>/</span>
        <span>{course.code}</span>
      </nav>

      <div className="detail-card">
        <div className="course-top">
          <span className="course-code">{course.code}</span>
          <span className={`level-badge ${course.level.toLowerCase()}`}>
            {course.level}
          </span>
        </div>
        <h1>{course.name}</h1>
        <p className="english-name">{course.englishName}</p>
        <div className="detail-meta">
          <span>หน่วยกิต: {course.credit}</span>
          <span>หมวด: {course.category}</span>
        </div>

        <h2>คำอธิบายรายวิชา</h2>
        <p>{course.description}</p>

        <h2>ผลลัพธ์การเรียนรู้ที่คาดหวัง</h2>
        <ul className="outcome-list">
          {course.outcomes.map((outcome, index) => (
            <li key={index}>{outcome}</li>
          ))}
        </ul>

        <div className="detail-actions">
          <button
            type="button"
            className="secondary-button back-btn"
            onClick={() => navigate(-1)}
          >
            ← ย้อนกลับ
          </button>
          <Link className="primary-button" to="/courses">
            กลับไปหน้ารายวิชา
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CourseDetailPage