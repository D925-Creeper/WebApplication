import './App.css'
import Header from './components/Header'
import Navigation from './components/Navigation'
import CourseInfo from './components/CourseInfo'
import TopicList from './components/TopicList'
import ToolList from './components/ToolList'
import LearningOutcome from './components/LearningOutcome'
import InstructorInfo from './components/InstructorInfo'
import AssessmentInfo from './components/AssessmentInfo'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Header />
      <Navigation />
      <main className="main-content">
        <InstructorInfo />
        <CourseInfo />
        <TopicList />
        <ToolList />
        <LearningOutcome />
        <AssessmentInfo />
      </main>
      <Footer />
    </div>
  )
}

export default App