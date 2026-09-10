import { useState } from "react"
import "./App.css"
import Header from "./components/Header"
import Navbar from "./components/Navbar"
import StatSection from "./components/StatSection"
import SearchBox from "./components/SearchBox"
import CourseGrid from "./components/CourseGrid"
import ActivityTable from "./components/ActivityTable"
import Footer from "./components/Footer"

function App() {
  const [searchText, setSearchText] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [darkMode, setDarkMode] = useState(false)

  const stats = [
    {
      id: 1,
      title: "บทเรียนทั้งหมด",
      value: "15",
      description: "ครอบคลุม Frontend, Backend และ Database",
      icon: "📚"
    },
    {
      id: 2,
      title: "Lab ปฏิบัติการ",
      value: "15",
      description: "ฝึกพัฒนาระบบจริงตามลำดับขั้น",
      icon: "💻"
    },
    {
      id: 3,
      title: "เครื่องมือหลัก",
      value: "React",
      description: "พัฒนา UI แบบ Component-Based",
      icon: "⚛️"
    },
    {
      id: 4,
      title: "เป้าหมาย",
      value: "Project",
      description: "พัฒนาเว็บแอปพลิเคชันใช้งานได้จริง",
      icon: "🚀"
    }
  ]

  const courses = [
    {
      id: 1,
      code: "4123307",
      name: "การพัฒนาเว็บแอปพลิเคชัน",
      description: "การพัฒนาเว็บด้วย React, API, Backend และฐานข้อมูล",
      credit: "3(2-2-5)",
      category: "Web Development",
      level: "Advanced"
    },
    {
      id: 2,
      code: "4121306",
      name: "การเขียนโปรแกรมเชิงวัตถุ",
      description: "หลักการเขียนโปรแกรมเชิงวัตถุ Class, Object และ Reuse",
      credit: "3(2-2-5)",
      category: "Programming",
      level: "Intermediate"
    },
    {
      id: 3,
      code: "4122205",
      name: "ระบบฐานข้อมูลและการออกแบบ",
      description: "การออกแบบฐานข้อมูล ตาราง ความสัมพันธ์ และ SQL",
      credit: "3(2-2-5)",
      category: "Database",
      level: "Intermediate"
    },
    {
      id: 4,
      code: "4121205",
      name: "อัลกอริทึมและการออกแบบโปรแกรม",
      description: "การคิดเชิงอัลกอริทึม การวิเคราะห์ปัญหา และการออกแบบวิธีแก้ปัญหา",
      credit: "3(2-2-5)",
      category: "Computer Science",
      level: "Beginner"
    },
    {
      id: 5,
      code: "LAB-UI",
      name: "การออกแบบ UI และ Responsive Layout",
      description: "ฝึกออกแบบ Card, Grid, Table และ Form ให้เหมาะสมกับทุกหน้าจอ",
      credit: "Lab",
      category: "UI Design",
      level: "Beginner"
    },
    {
      id: 6,
      code: "LAB-API",
      name: "การเชื่อมต่อ API",
      description: "ฝึกเรียกข้อมูลจาก API และแสดงผลใน React Application",
      credit: "Lab",
      category: "Backend",
      level: "Advanced"
    }
  ]

  const activities = [
    {
      id: 1,
      week: "1",
      topic: "บทนำสู่เว็บแอปพลิเคชัน",
      activity: "วิเคราะห์ระบบเว็บ",
      outcome: "เข้าใจองค์ประกอบของเว็บ"
    },
    {
      id: 2,
      week: "3",
      topic: "HTML, CSS และ JavaScript",
      activity: "สร้างเว็บเพจพื้นฐาน",
      outcome: "สร้างหน้าเว็บแบบ Static ได้"
    },
    {
      id: 3,
      week: "5",
      topic: "React Component",
      activity: "แยกหน้าเว็บเป็น Component",
      outcome: "เข้าใจ Component-Based Development"
    },
    {
      id: 4,
      week: "10",
      topic: "Responsive Web Design",
      activity: "ออกแบบ Course Dashboard",
      outcome: "สร้าง UI ที่รองรับหลายหน้าจอ"
    }
  ]

  const filteredCourses = courses.filter((course) => {
    const keyword = searchText.toLowerCase()
    const matchesSearch =
      course.name.toLowerCase().includes(keyword) ||
      course.description.toLowerCase().includes(keyword) ||
      course.category.toLowerCase().includes(keyword) ||
      course.level.toLowerCase().includes(keyword)

    const matchesLevel =
      selectedLevel === "All" || course.level.toLowerCase() === selectedLevel.toLowerCase()

    return matchesSearch && matchesLevel
  })

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <Header />
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <main className="main-content">
        <StatSection stats={stats} />
        <SearchBox
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
        />
        <CourseGrid courses={filteredCourses} />
        <ActivityTable activities={activities} />
      </main>
      <Footer />
    </div>
  )
}

export default App