function CourseSummary({ totalCourses, coreCourses }) {
  return (
    <div className="section" style={{ borderLeft: '6px solid #34a853' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#34a853' }}>สรุปภาพรวมรายวิชา</h3>
      <p style={{ margin: '4px 0' }}>จำนวนรายวิชาทั้งหมด: <strong>{totalCourses}</strong> วิชา</p>
      <p style={{ margin: '4px 0' }}>จำนวนรายวิชาหลัก: <strong>{coreCourses}</strong> วิชา</p>
    </div>
  )
}

export default CourseSummary