import CourseCard from "./CourseCard"

function CourseGrid({ courses }) {
  return (
    <section id="courses" className="section">
      <div className="section-heading">
        <h2>รายวิชาและหัวข้อที่เกี่ยวข้อง</h2>
        <p>แสดงผลแบบ Responsive Grid และปรับจำนวนคอลัมน์ตามขนาดหน้าจอ</p>
      </div>
      {courses.length === 0 ? (
        <p className="empty-message">ไม่พบข้อมูลรายวิชาที่ตรงกับคำค้นหา</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}

export default CourseGrid