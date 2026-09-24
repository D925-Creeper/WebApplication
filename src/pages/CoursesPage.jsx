import { useState } from "react"
import CourseCard from "../components/CourseCard"
import { courses } from "../data/courses"

function CoursesPage() {
  const [searchText, setSearchText] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("All")

  const filteredCourses = courses.filter((course) => {
    const keyword = searchText.toLowerCase()
    const matchesSearch =
      course.code.toLowerCase().includes(keyword) ||
      course.name.toLowerCase().includes(keyword) ||
      course.englishName.toLowerCase().includes(keyword) ||
      course.category.toLowerCase().includes(keyword)

    const matchesLevel =
      selectedLevel === "All" || course.level.toLowerCase() === selectedLevel.toLowerCase()

    return matchesSearch && matchesLevel
  })

  return (
    <section className="page-section">
      <div className="section-heading">
        <h1>รายการรายวิชา</h1>
        <p>
          แสดงข้อมูลรายวิชาที่เกี่ยวข้องกับการพัฒนาเว็บแอปพลิเคชันและพื้นฐานทางคอมพิวเตอร์
        </p>
      </div>

      <div className="filter-wrapper">
        <div className="search-box">
          <label htmlFor="courseSearch">ค้นหารายวิชา</label>
          <div className="search-input-group">
            <input
              id="courseSearch"
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="ค้นหาด้วยรหัสวิชา ชื่อวิชา หรือหมวดหมู่"
            />
            {searchText && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchText("")}
              >
                ล้าง
              </button>
            )}
          </div>
        </div>

        <div className="level-filter">
          <label htmlFor="levelSelect">ระดับความยาก</label>
          <select
            id="levelSelect"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="All">ทุกระดับ</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <p className="search-result-count">
        พบข้อมูลรายวิชาทั้งหมด <strong>{filteredCourses.length}</strong> รายการ
      </p>

      {filteredCourses.length === 0 ? (
        <p className="empty-message">ไม่พบรายวิชาที่ตรงกับคำค้นหา</p>
      ) : (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}

export default CoursesPage