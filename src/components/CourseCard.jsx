function CourseCard({ course, onDeleteCourse }) {
  const badgeClass = course.source
    ? course.source.toLowerCase().replaceAll(" ", "-")
    : "local"

  return (
    <article className="course-card">
      <div className="course-top">
        <span className="course-code">{course.code}</span>
        <span className={`source-badge ${badgeClass}`}>{course.source}</span>
      </div>
      <h3>{course.name}</h3>
      <p className="english-name">{course.englishName}</p>
      <div className="course-meta">
        <span>{course.credit}</span>
        <span>{course.category}</span>
      </div>
      <button
        type="button"
        className="danger"
        onClick={() => onDeleteCourse(course.id)}
      >
        ลบรายการ
      </button>
    </article>
  )
}

export default CourseCard