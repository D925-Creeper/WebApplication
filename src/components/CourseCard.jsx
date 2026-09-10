function CourseCard({ course }) {
  return (
    <article className="course-card">
      <div className="course-top">
        <span className="course-code">{course.code}</span>
        <span className={`level-badge ${course.level.toLowerCase()}`}>
          {course.level}
        </span>
      </div>
      <h3>{course.name}</h3>
      <p className="course-description">{course.description}</p>
      <div className="course-meta">
        <span>{course.credit}</span>
        <span>{course.category}</span>
      </div>
    </article>
  )
}

export default CourseCard