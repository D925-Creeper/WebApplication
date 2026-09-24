import { useState } from "react"

const initialFormData = {
  code: "",
  name: "",
  englishName: "",
  credit: "3(2-2-5)",
  category: "Web Development"
}

function CourseForm({ onSubmitCourse, submitting }) {
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

    if (formData.code.trim() === "") {
      setError("กรุณากรอกรหัสวิชา")
      return
    }
    if (formData.name.trim() === "") {
      setError("กรุณากรอกชื่อวิชาภาษาไทย")
      return
    }
    if (formData.englishName.trim() === "") {
      setError("กรุณากรอกชื่อวิชาภาษาอังกฤษ")
      return
    }

    onSubmitCourse({
      ...formData,
      code: formData.code.trim(),
      name: formData.name.trim(),
      englishName: formData.englishName.trim()
    })
    setFormData(initialFormData)
    setError("")
  }

  return (
    <section className="card">
      <div className="section-heading">
        <h2>เพิ่มข้อมูลรายวิชาผ่าน Form</h2>
        <p>ข้อมูลที่กรอกจะถูกส่งไปยัง API ด้วย HTTP Method แบบ POST</p>
      </div>
      <form className="course-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="code">รหัสวิชา</label>
            <input
              id="code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
              placeholder="เช่น 4123307"
            />
          </div>
          <div className="form-group">
            <label htmlFor="credit">หน่วยกิต</label>
            <input
              id="credit"
              name="credit"
              type="text"
              value={formData.credit}
              onChange={handleChange}
              placeholder="เช่น 3(2-2-5)"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="name">ชื่อวิชาภาษาไทย</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="กรอกชื่อวิชาภาษาไทย"
          />
        </div>
        <div className="form-group">
          <label htmlFor="englishName">ชื่อวิชาภาษาอังกฤษ</label>
          <input
            id="englishName"
            name="englishName"
            type="text"
            value={formData.englishName}
            onChange={handleChange}
            placeholder="กรอกชื่อวิชาภาษาอังกฤษ"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">หมวดหมู่</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Web Development">Web Development</option>
            <option value="Programming">Programming</option>
            <option value="Database">Database</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "กำลังส่งข้อมูล..." : "ส่งข้อมูลไปยัง API"}
        </button>
      </form>
    </section>
  )
}

export default CourseForm