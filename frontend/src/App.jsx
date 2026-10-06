import { useEffect, useState } from "react"
import "./App.css"
import Header from "./components/Header"
import StatusMessage from "./components/StatusMessage"
import CourseForm from "./components/CourseForm"
import CourseTable from "./components/CourseTable"
import Footer from "./components/Footer"
import { getCourses, createCourse, updateCourse, deleteCourse } from "./services/courseApi"

function App() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const loadCourses = async () => {
    try {
      setLoading(true)
      setMessage({ type: "loading", text: "กำลังโหลดข้อมูลรายวิชา..." })
      const data = await getCourses()
      setCourses(data)
      setMessage({ type: "success", text: "โหลดข้อมูลรายวิชาสำเร็จ" })
    } catch (error) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    document.title = `Full Stack Courses: ${courses.length} รายการ`
  }, [courses.length])

  const handleSubmitCourse = async (courseData) => {
    try {
      setSubmitting(true)
      if (editingCourse) {
        const result = await updateCourse(editingCourse.id, courseData)
        setCourses(
          courses.map((course) =>
            course.id === editingCourse.id ? result.course : course
          )
        )
        setEditingCourse(null)
        setMessage({ type: "success", text: "แก้ไขข้อมูลรายวิชาสำเร็จ" })
      } else {
        const result = await createCourse(courseData)
        setCourses([result.course, ...courses])
        setMessage({ type: "success", text: "เพิ่มข้อมูลรายวิชาสำเร็จ" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCourse = (course) => {
    setEditingCourse(course)
    setMessage({ type: "info", text: `กำลังแก้ไขรายวิชา ${course.code}` })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancelEdit = () => {
    setEditingCourse(null)
  }

  const handleDeleteCourse = async (id) => {
    const confirmDelete = window.confirm("ยืนยันการลบข้อมูลรายวิชานี้หรือไม่")
    if (!confirmDelete) return

    try {
      await deleteCourse(id)
      setCourses(courses.filter((course) => course.id !== id))
      setMessage({ type: "success", text: "ลบข้อมูลรายวิชาสำเร็จ" })
    } catch (error) {
      setMessage({ type: "error", text: error.message })
    }
  }

  const filteredCourses = courses.filter((course) => {
    const keyword = searchText.toLowerCase()
    const matchesSearch =
      course.code.toLowerCase().includes(keyword) ||
      course.name_th.toLowerCase().includes(keyword) ||
      course.name_en.toLowerCase().includes(keyword)

    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <section className="summary-grid">
          <article className="summary-card">
            <h3>{courses.length}</h3>
            <p>จำนวนรายวิชา</p>
          </article>
          <article className="summary-card">
            <h3>React</h3>
            <p>Frontend</p>
          </article>
          <article className="summary-card">
            <h3>Express</h3>
            <p>Backend</p>
          </article>
          <article className="summary-card">
            <h3>MySQL</h3>
            <p>Database</p>
          </article>
        </section>

        <StatusMessage type={message.type} message={message.text} />

        <CourseForm
          onSubmitCourse={handleSubmitCourse}
          editingCourse={editingCourse}
          onCancelEdit={handleCancelEdit}
          submitting={submitting}
        />

        <section className="card filter-card">
          <div className="filter-grid">
            <div className="form-group">
              <label htmlFor="search">ค้นหารายวิชา</label>
              <input
                id="search"
                type="text"
                placeholder="ค้นหาด้วยรหัส หรือชื่อวิชา..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryFilter">หมวดหมู่</label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">ทุกหมวดหมู่</option>
                <option value="Web Development">Web Development</option>
                <option value="Programming">Programming</option>
                <option value="Database">Database</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner" aria-label="กำลังโหลดข้อมูล"></div>
          </div>
        ) : (
          <CourseTable
            courses={filteredCourses}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App