import { useState } from "react"
import "./App.css"
import Header from "./components/Header"
import RegisterForm from "./components/RegisterForm"
import RegisterList from "./components/RegisterList"
import SummaryBox from "./components/SummaryBox"
import Footer from "./components/Footer"

function App() {
  const [registers, setRegisters] = useState([])

  const addRegister = (newRegister) => {
    setRegisters([...registers, newRegister])
  }

  const deleteRegister = (registerId) => {
    const updatedRegisters = registers.filter((register) => register.id !== registerId)
    setRegisters(updatedRegisters)
  }

  const clearAllRegisters = () => {
    if (window.confirm("ยืนยันการลบข้อมูลทั้งหมดหรือไม่?")) {
      setRegisters([])
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <SummaryBox registers={registers} />
        <RegisterForm onAddRegister={addRegister} />
        <div className="list-header">
          <h2>ข้อมูลที่บันทึกแล้ว</h2>
          {registers.length > 0 && (
            <button className="danger" onClick={clearAllRegisters}>
              ลบทั้งหมด
            </button>
          )}
        </div>
        <RegisterList registers={registers} onDeleteRegister={deleteRegister} />
      </main>
      <Footer />
    </div>
  )
}

export default App