import { useState } from "react"

function TopicForm({ onAddTopic }) {
  const [topicName, setTopicName] = useState("")
  const [topicLevel, setTopicLevel] = useState("Beginner")
  const [error, setError] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()

    if (topicName.trim() === "") {
      setError("กรุณากรอกชื่อหัวข้อการเรียนรู้")
      return
    }

    // ตอนที่ 14: ตรวจสอบความยาวอย่างน้อย 3 ตัวอักษร
    if (topicName.trim().length < 3) {
      setError("ชื่อหัวข้อต้องมีความยาวอย่างน้อย 3 ตัวอักษร")
      return
    }

    const newTopic = {
      id: Date.now(),
      name: topicName.trim(),
      level: topicLevel,
      completed: false
    }

    onAddTopic(newTopic)
    setTopicName("")
    setTopicLevel("Beginner")
    setError("")
  }

  return (
    <section className="card">
      <h2>เพิ่มหัวข้อการเรียนรู้</h2>
      <form className="topic-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topicName">ชื่อหัวข้อ</label>
          <input
            id="topicName"
            type="text"
            value={topicName}
            onChange={(event) => setTopicName(event.target.value)}
            placeholder="เช่น React State, Event Handling"
          />
        </div>
        <div className="form-group">
          <label htmlFor="topicLevel">ระดับความยาก</label>
          <select
            id="topicLevel"
            value={topicLevel}
            onChange={(event) => setTopicLevel(event.target.value)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">เพิ่มหัวข้อ</button>
      </form>
    </section>
  )
}

export default TopicForm