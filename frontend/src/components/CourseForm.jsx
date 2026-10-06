import { useEffect, useState } from "react"

const initialFormData = {
  code: "",
  name_th: "",
  name_en: "",
  credit: "3(2-2-5)",
  category: "Web Development",
  description: ""
}

function CourseForm({ onSubmitCourse, editingCourse, onCancelEdit, submitting }) {
  const [formData, setFormData] = useState(initialFormData)
  const [error, setError] = useState("")

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        code: editingCourse.code || "",
        name_th: editingCourse.name_th || "",
        name_en: editingCourse.name_en || "",
        credit: editingCourse.credit || "3(2-2-5)",
        category: editingCourse.category || "Web Development",
        description: editingCourse.description || ""
      })
    } else {
      setFormData(initialFormData)
    }
  }, [editingCourse])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.code.trim()) {
      setError("กรุณากรอกรหัสวิชา")
      return
    }
    if (!formData.name_th.trim()) {
      setError("กรุณากรอกชื่อวิชาภาษาไทย")
      return
    }
    if (!formData.name_en.trim()) {
      setError("กรุณากรอกชื่อวิชาภาษาอังกฤษ")
      return
    }

    onSubmitCourse(formData)
    setError("")
    if (!editingCourse) setFormData(initialFormData)
  }

  return (
    <section className="card">
      <div className="section-heading">
        <h2>{editingCourse ? "แก้ไขข้อมูลรายวิชา" : "เพิ่มข้อมูลรายวิชา"}</h2>
        <p>กรอกข้อมูลรายวิชาเพื่อบันทึกลงฐานข้อมูลผ่าน Backend API</p>
      </div>
      <form className="course-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="code">รหัสวิชา</label>
            <input
              id="code"
              name="code"
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
              value={formData.credit}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="name_th">ชื่อวิชาภาษาไทย</label>
          <input
            id="name_th"
            name="name_th"
            value={formData.name_th}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name_en">ชื่อวิชาภาษาอังกฤษ</label>
          <input
            id="name_en"
            name="name_en"
            value={formData.name_en}
            onChange={handleChange}
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
        <div className="form-group">
          <label htmlFor="description">คำอธิบายรายวิชา</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button type="submit" disabled={submitting}>
            {submitting ? "กำลังบันทึก..." : editingCourse ? "บันทึกการแก้ไข" : "เพิ่มรายวิชา"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setFormData(initialFormData)
              onCancelEdit()
            }}
          >
            ล้างข้อมูล
          </button>
        </div>
      </form>
    </section>
  )
}

export default CourseForm