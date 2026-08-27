import { useState } from "react"

function StudentProfile({ onProfileChange }) {
  const [studentName, setStudentName] = useState("")
  const [studentId, setStudentId] = useState("")

  const handleNameChange = (e) => {
    const val = e.target.value
    setStudentName(val)
    if (onProfileChange) onProfileChange({ name: val, id: studentId })
  }

  const handleIdChange = (e) => {
    const val = e.target.value
    setStudentId(val)
    if (onProfileChange) onProfileChange({ name: studentName, id: val })
  }

  return (
    <section className="card">
      <h2>ข้อมูลผู้เรียน</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="studentName">ชื่อ - สกุล</label>
          <input
            id="studentName"
            type="text"
            value={studentName}
            onChange={handleNameChange}
            placeholder="กรอกชื่อ - สกุล"
          />
        </div>
        <div className="form-group">
          <label htmlFor="studentId">รหัสนักศึกษา</label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={handleIdChange}
            placeholder="กรอกรหัสนักศึกษา"
          />
        </div>
      </div>
      <div className="profile-preview">
        <h3>ตัวอย่างข้อมูลที่จะแสดง</h3>
        {studentName === "" && studentId === "" ? (
          <p className="empty-message">ยังไม่มีข้อมูลผู้เรียน</p>
        ) : (
          <p>
            ผู้เรียน: <strong>{studentName || "ยังไม่ระบุชื่อ"}</strong>{" "}
            รหัสนักศึกษา: <strong>{studentId || "ยังไม่ระบุรหัส"}</strong>
          </p>
        )}
      </div>
    </section>
  )
}

export default StudentProfile