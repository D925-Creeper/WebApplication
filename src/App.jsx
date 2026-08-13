import "./App.css"
import Header from "./components/Header"
import CourseList from "./components/CourseList"
import ToolList from "./components/ToolList"
import CourseSummary from "./components/CourseSummary"
import Footer from "./components/Footer"

function App() {
  const courses = [
    {
      id: 1,
      code: "4123307",
      name: "การพัฒนาเว็บแอปพลิเคชัน",
      englishName: "Web Application Development",
      credit: "3(2-2-5)",
      category: "Web Development",
      isCore: true,
      year: 3,
      semester: 1
    },
    {
      id: 2,
      code: "4121306",
      name: "การเขียนโปรแกรมเชิงวัตถุ",
      englishName: "Object-Oriented Programming",
      credit: "3(2-2-5)",
      category: "Programming",
      isCore: true,
      year: 2,
      semester: 1
    },
    {
      id: 3,
      code: "4122205",
      name: "ระบบฐานข้อมูลและการออกแบบ",
      englishName: "Database Systems and Design",
      credit: "3(2-2-5)",
      category: "Database",
      isCore: false,
      year: 2,
      semester: 2
    },
    {
      id: 4,
      code: "4121205",
      name: "อัลกอริทึมและการออกแบบโปรแกรม",
      englishName: "Algorithms and Program Design",
      credit: "3(2-2-5)",
      category: "Computer Science",
      isCore: true,
      year: 1,
      semester: 2
    },
    {
      id: 5,
      code: "4123201",
      name: "วิศวกรรมซอฟต์แวร์",
      englishName: "Software Engineering",
      credit: "3(3-0-6)",
      category: "Software Engineering",
      isCore: false,
      year: 3,
      semester: 2
    },
    {
      id: 6,
      code: "4123801",
      name: "เตรียมสหกิจศึกษาทางวิทยาการคอมพิวเตอร์",
      englishName: "Preparation for Cooperative Education",
      credit: "1(0-2-1)",
      category: "Computer Science",
      isCore: true,
      year: 3,
      semester: 2
    }
  ]

  const tools = [
    { id: 1, name: "HTML", type: "frontend" },
    { id: 2, name: "CSS", type: "frontend" },
    { id: 3, name: "JavaScript", type: "frontend" },
    { id: 4, name: "React", type: "frontend" },
    { id: 5, name: "Vite", type: "tool" },
    { id: 6, name: "Node.js", type: "backend" },
    { id: 7, name: "npm", type: "tool" },
    { id: 8, name: "VS Code", type: "tool" }
  ]

  const totalCourses = courses.length
  const coreCourses = courses.filter((course) => course.isCore).length

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <CourseSummary totalCourses={totalCourses} coreCourses={coreCourses} />
        <CourseList courses={courses} />
        <ToolList tools={tools} />
      </main>
      <Footer
        studentName="นายสมชาย ใจดี"
        studentId="660000000"
      />
    </div>
  )
}

export default App