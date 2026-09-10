import { useEffect, useState } from "react"

function CourseLoader() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCourses = () => {
      setLoading(true)
      setError("")

      setTimeout(() => {
        const shouldFail = false

        if (shouldFail) {
          setError("ไม่สามารถโหลดข้อมูลรายวิชาได้")
          setLoading(false)
          return
        }

        const courseData = [
          {
            id: 1,
            code: "4123307",
            name: "การพัฒนาเว็บแอปพลิเคชัน",
            topic: "React, API และ Backend"
          },
          {
            id: 2,
            code: "4121306",
            name: "การเขียนโปรแกรมเชิงวัตถุ",
            topic: "Class, Object และ Inheritance"
          },
          {
            id: 3,
            code: "4122205",
            name: "ระบบฐานข้อมูลและการออกแบบ",
            topic: "ER Diagram และ SQL"
          }
        ]

        setCourses(courseData)
        setLoading(false)
      }, 1200)
    }

    loadCourses()
  }, [])

  return (
    <section className="card">
      <h2>ข้อมูลรายวิชาจำลอง</h2>
      <p className="section-description">
        ตัวอย่างการโหลดข้อมูลเมื่อ Component เริ่มทำงาน
      </p>

      {loading && <p className="loading-message">กำลังโหลดข้อมูล...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <p className="empty-message">ไม่พบข้อมูลรายวิชา</p>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="course-grid">
          {courses.map((course) => (
            <article key={course.id} className="course-card">
              <h3>{course.code}</h3>
              <h4>{course.name}</h4>
              <p>{course.topic}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default CourseLoader