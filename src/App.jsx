import { Route, Routes } from "react-router"
import "./App.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import CoursesPage from "./pages/CoursesPage"
import CourseDetailPage from "./pages/CourseDetailPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import NotFoundPage from "./pages/NotFoundPage"

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseCode" element={<CourseDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App