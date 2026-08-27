import TopicItem from "./TopicItem"

function TopicList({ topics, onToggleComplete, onDeleteTopic, onClearAll, onMarkAllCompleted }) {
  const completedCount = topics.filter((topic) => topic.completed).length

  return (
    <section className="card">
      <h2>รายการหัวข้อการเรียนรู้</h2>
      <div className="list-summary">
        <p>จำนวนหัวข้อทั้งหมด: {topics.length}</p>
        <p>เรียนรู้แล้ว: {completedCount}</p>
        <p>คงเหลือ: {topics.length - completedCount}</p>
      </div>

      {/* ตอนที่ 14: ปุ่มลบทั้งหมด และ ปุ่มทำเครื่องหมายว่าเรียนแล้วทั้งหมด */}
      {topics.length > 0 && (
        <div className="button-group" style={{ marginBottom: "18px" }}>
          <button onClick={onMarkAllCompleted}>
            ทำเครื่องหมายว่าเรียนแล้วทั้งหมด
          </button>
          <button className="danger" onClick={onClearAll}>
            ลบทั้งหมด
          </button>
        </div>
      )}

      {topics.length === 0 ? (
        <p className="empty-message">ยังไม่มีหัวข้อการเรียนรู้</p>
      ) : (
        <ul className="topic-list">
          {topics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              onToggleComplete={onToggleComplete}
              onDeleteTopic={onDeleteTopic}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default TopicList