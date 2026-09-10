import { useEffect, useState } from "react"
import "./App.css"
import Header from "./components/Header"
import UsageTimer from "./components/UsageTimer"
import LearningForm from "./components/LearningForm"
import LearningList from "./components/LearningList"
import CourseLoader from "./components/CourseLoader"
import SummaryBox from "./components/SummaryBox"
import Footer from "./components/Footer"

const STORAGE_KEY = "lab9-learnings"

function App() {
  const [learnings, setLearnings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด")
  const [notification, setNotification] = useState("")

  // โหลดข้อมูลเริ่มต้นจาก localStorage
  useEffect(() => {
    try {
      const savedLearnings = localStorage.getItem(STORAGE_KEY)
      if (savedLearnings) {
        setLearnings(JSON.parse(savedLearnings))
      }
    } catch (err) {
      console.error("ไม่สามารถอ่านข้อมูลจาก Local Storage ได้", err)
    }
  }, [])

  // บันทึกข้อมูลลง localStorage เมื่อ learnings เปลี่ยน
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(learnings))
  }, [learnings])

  // เปลี่ยนชื่อ Browser Tab ตามจำนวนหัวข้อ
  useEffect(() => {
    document.title = `หัวข้อการเรียนรู้: ${learnings.length} รายการ`
  }, [learnings.length])

  // ฟังก์ชันเพิ่มหัวข้อใหม่ + แจ้งเตือนเมื่อบันทึกสำเร็จ
  const addLearning = (newLearning) => {
    setLearnings([...learnings, newLearning])
    setNotification("บันทึกหัวข้อการเรียนรู้สำเร็จ!")
    setTimeout(() => {
      setNotification("")
    }, 2500)
  }

  // เปลี่ยนสถานะเสร็จ / ยังไม่เสร็จ
  const toggleComplete = (learningId) => {
    const updatedLearnings = learnings.map((item) => {
      if (item.id === learningId) {
        return {
          ...item,
          completed: !item.completed
        }
      }
      return item
    })
    setLearnings(updatedLearnings)
  }

  // ลบทีละรายการ
  const deleteLearning = (learningId) => {
    const updatedLearnings = learnings.filter(
      (item) => item.id !== learningId
    )
    setLearnings(updatedLearnings)
  }

  // ลบทั้งหมด
  const clearAllLearnings = () => {
    const confirmClear = window.confirm("ต้องการลบหัวข้อทั้งหมดหรือไม่")
    if (confirmClear) {
      setLearnings([])
    }
  }

  // ปรับแต่งเพิ่มเติม 1: เรียนรู้แล้วทั้งหมด
  const markAllCompleted = () => {
    const updatedLearnings = learnings.map((item) => ({ ...item, completed: true }))
    setLearnings(updatedLearnings)
  }

  // ปรับแต่งเพิ่มเติม 2: ล้างเฉพาะรายการที่เรียนรู้แล้ว
  const removeCompleted = () => {
    const updatedLearnings = learnings.filter((item) => !item.completed)
    setLearnings(updatedLearnings)
  }

  // ปรับแต่งเพิ่มเติม 3 & 4: กรองข้อมูลตามคำค้นหาและหมวดหมู่
  const filteredLearnings = learnings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "ทั้งหมด" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <UsageTimer />
        <SummaryBox learnings={learnings} />

        {notification && <div className="success-banner">{notification}</div>}

        <LearningForm onAddLearning={addLearning} />

        {/* เครื่องมือค้นหาและตัวกรอง */}
        <section className="card filter-card">
          <h2>ค้นหาและกรองหัวข้อ</h2>
          <div className="filter-controls">
            <input
              type="text"
              placeholder="ค้นหาชื่อหัวข้อ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ทั้งหมด">ทุกหมวดหมู่</option>
              <option value="React">React</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
            </select>
          </div>
        </section>

        <div className="list-toolbar">
          <h2>หัวข้อที่บันทึกไว้ ({filteredLearnings.length})</h2>
          <div className="toolbar-actions">
            {learnings.length > 0 && (
              <>
                <button onClick={markAllCompleted}>เรียนรู้แล้วทั้งหมด</button>
                <button onClick={removeCompleted}>ล้างที่เรียนรู้แล้ว</button>
                <button className="danger" onClick={clearAllLearnings}>
                  ลบทั้งหมด
                </button>
              </>
            )}
          </div>
        </div>

        <LearningList
          learnings={filteredLearnings}
          onToggleComplete={toggleComplete}
          onDeleteLearning={deleteLearning}
        />

        <CourseLoader />
      </main>
      <Footer />
    </div>
  )
}

export default App