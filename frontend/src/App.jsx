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

  useEffect(() => { loadCourses() }, [])

  const handleSubmitCourse = async (courseData) => {
    try {
      setSubmitting(true)
      if (editingCourse) {
        const result = await updateCourse(editingCourse.id, courseData)
        setCourses(courses.map((c) => c.id === editingCourse.id ? result.course : c))
        setEditingCourse(null)
        setMessage({ type: "success", text: "แก้ไขข้อมูลสำเร็จ" })
      } else {
        const result = await createCourse(courseData)
        setCourses([result.course, ...courses])
        setMessage({ type: "success", text: "เพิ่มข้อมูลสำเร็จ" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("ยืนยันการลบข้อมูลรายวิชานี้หรือไม่")) return
    try {
      await deleteCourse(id)
      setCourses(courses.filter((c) => c.id !== id))
      setMessage({ type: "success", text: "ลบข้อมูลสำเร็จ" })
    } catch (error) {
      setMessage({ type: "error", text: error.message })
    }
  }

  const filteredCourses = courses.filter((c) =>
    c.code.toLowerCase().includes(searchText.toLowerCase()) ||
    c.name_th.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <section className="summary-grid">
          <article className="summary-card"><h3>{courses.length}</h3><p>จำนวนรายวิชา</p></article>
          <article className="summary-card"><h3>React</h3><p>Frontend</p></article>
          <article className="summary-card"><h3>Express</h3><p>Backend</p></article>
          <article className="summary-card"><h3>MySQL</h3><p>Database</p></article>
        </section>

        <StatusMessage type={message.type} message={message.text} />

        <CourseForm
          onSubmitCourse={handleSubmitCourse}
          editingCourse={editingCourse}
          onCancelEdit={() => setEditingCourse(null)}
          submitting={submitting}
        />

        <section className="card">
          <input
            type="text"
            placeholder="ค้นหารหัสวิชา หรือชื่อวิชา..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </section>

        {loading ? (
          <p className="status-message loading">กำลังโหลดข้อมูล...</p>
        ) : (
          <CourseTable
            courses={filteredCourses}
            onEditCourse={(c) => { setEditingCourse(c); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            onDeleteCourse={handleDeleteCourse}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
export default App