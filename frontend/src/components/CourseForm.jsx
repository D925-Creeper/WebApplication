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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.code.trim() || !formData.name_th.trim() || !formData.name_en.trim()) {
      setError("กรุณากรอกข้อมูลสำคัญให้ครบถ้วน")
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
            <label>รหัสวิชา</label>
            <input name="code" value={formData.code} onChange={handleChange} placeholder="เช่น 4123307" />
          </div>
          <div className="form-group">
            <label>หน่วยกิต</label>
            <input name="credit" value={formData.credit} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label>ชื่อวิชาภาษาไทย</label>
          <input name="name_th" value={formData.name_th} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>ชื่อวิชาภาษาอังกฤษ</label>
          <input name="name_en" value={formData.name_en} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>หมวดหมู่</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Web Development">Web Development</option>
            <option value="Programming">Programming</option>
            <option value="Database">Database</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
          </select>
        </div>
        <div className="form-group">
          <label>คำอธิบายรายวิชา</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button type="submit" disabled={submitting}>
            {submitting ? "กำลังบันทึก..." : editingCourse ? "บันทึกการแก้ไข" : "เพิ่มรายวิชา"}
          </button>
          <button type="button" className="secondary" onClick={() => { setFormData(initialFormData); onCancelEdit(); }}>
            ล้างข้อมูล
          </button>
        </div>
      </form>
    </section>
  )
}
export default CourseForm