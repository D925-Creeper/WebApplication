import { useState } from "react"

const initialFormData = {
  title: "",
  category: "",
  priority: "ปานกลาง"
}

function LearningForm({ onAddLearning }) {
  const [formData, setFormData] = useState(initialFormData)
  const [error, setError] = useState("")

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (formData.title.trim() === "") {
      setError("กรุณากรอกหัวข้อการเรียนรู้")
      return
    }

    if (formData.category === "") {
      setError("กรุณาเลือกหมวดหมู่")
      return
    }

    const newLearning = {
      id: Date.now(),
      title: formData.title.trim(),
      category: formData.category,
      priority: formData.priority,
      completed: false,
      createdAt: new Date().toLocaleString("th-TH")
    }

    onAddLearning(newLearning)
    setFormData(initialFormData)
    setError("")
  }

  return (
    <section className="card">
      <h2>เพิ่มหัวข้อการเรียนรู้</h2>
      <p className="section-description">
        กรอกหัวข้อที่ต้องการเรียนรู้ ระบบจะบันทึกข้อมูลลงใน Local Storage โดยอัตโนมัติ
      </p>
      <form onSubmit={handleSubmit} className="learning-form">
        <div className="form-group">
          <label htmlFor="title">หัวข้อการเรียนรู้</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="เช่น useEffect, Local Storage, Fetch API"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="category">หมวดหมู่</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              <option value="React">React</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">ความสำคัญ</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="สูง">สูง</option>
              <option value="ปานกลาง">ปานกลาง</option>
              <option value="ต่ำ">ต่ำ</option>
            </select>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">บันทึกหัวข้อ</button>
      </form>
    </section>
  )
}

export default LearningForm