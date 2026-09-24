import CourseCard from "./CourseCard"

function CourseList({ courses, onDeleteCourse }) {
  if (courses.length === 0) {
    return (
      <section className="card">
        <h2>รายการข้อมูลรายวิชา</h2>
        <p className="empty-message">ยังไม่มีข้อมูลรายวิชา หรือไม่พบข้อมูลที่ตรงกับคำค้นหา</p>
      </section>
    )
  }

  return (
    <section className="card">
      <div className="section-heading">
        <h2>รายการข้อมูลรายวิชา ({courses.length} รายการ)</h2>
        <p>ข้อมูลจาก Local Data, Fetch API, Axios และ Form Input</p>
      </div>
      <div className="course-grid">
        {courses.map((course) => (
          <CourseCard
            key={`${course.source}-${course.id}`}
            course={course}
            onDeleteCourse={onDeleteCourse}
          />
        ))}
      </div>
    </section>
  )
}

export default CourseList