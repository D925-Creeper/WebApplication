function CourseTable({ courses, onEditCourse, onDeleteCourse }) {
  if (courses.length === 0) {
    return (
      <section className="card">
        <h2>รายการรายวิชา</h2>
        <p className="empty-message">ยังไม่มีข้อมูลรายวิชาในระบบ หรือไม่พบข้อมูลตามคำค้นหา</p>
      </section>
    )
  }

  return (
    <section className="card">
      <div className="section-heading">
        <h2>รายการรายวิชา ({courses.length} รายการ)</h2>
        <p>ข้อมูลนี้ถูกอ่านจากฐานข้อมูล MySQL ผ่าน Backend API</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชาภาษาไทย</th>
              <th>ชื่อวิชาภาษาอังกฤษ</th>
              <th>หน่วยกิต</th>
              <th>หมวดหมู่</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.code}</td>
                <td>{course.name_th}</td>
                <td>{course.name_en}</td>
                <td>{course.credit}</td>
                <td>{course.category}</td>
                <td>
                  <div className="table-actions">
                    <button className="secondary" onClick={() => onEditCourse(course)}>แก้ไข</button>
                    <button className="danger" onClick={() => onDeleteCourse(course.id)}>ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
export default CourseTable