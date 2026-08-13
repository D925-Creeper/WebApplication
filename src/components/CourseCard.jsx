function CourseCard({ code, name, englishName, credit, category, isCore, year, semester }) {
  return (
    <article className="course-card">
      <div className="course-header">
        <h3>{code}</h3>
        {isCore && <span className="badge core">รายวิชาหลัก</span>}
      </div>

      <div className="course-body">
        <h4>{name}</h4>
        <p className="english-name">{englishName}</p>
      </div>

      <div className="course-meta">
        <span>หน่วยกิต: {credit}</span>
        <span>หมวด: {category}</span>
        {year && semester && <span>ชั้นปีที่ {year} ภาคเรียนที่ {semester}</span>}
      </div>
    </article>
  )
}

export default CourseCard