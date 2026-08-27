function TopicItem({ topic, onToggleComplete, onDeleteTopic }) {
  // ตอนที่ 14: คลาสสีตามระดับความยาก
  const levelBadgeClass = {
    Beginner: "badge-beginner",
    Intermediate: "badge-intermediate",
    Advanced: "badge-advanced"
  }[topic.level] || ""

  return (
    <li className={`topic-item ${topic.completed ? "completed" : ""}`}>
      <div>
        <h3>{topic.name}</h3>
        <p>
          ระดับ: <span className={`level-badge ${levelBadgeClass}`}>{topic.level}</span>
        </p>
        <p>
          สถานะ:{" "}
          <span className={topic.completed ? "status-done" : "status-pending"}>
            {topic.completed ? "เรียนรู้แล้ว" : "ยังไม่เสร็จ"}
          </span>
        </p>
      </div>
      <div className="topic-actions">
        <button onClick={() => onToggleComplete(topic.id)}>
          {topic.completed ? "ยกเลิกสถานะ" : "ทำเครื่องหมายว่าเรียนแล้ว"}
        </button>
        <button
          className="danger"
          onClick={() => onDeleteTopic(topic.id)}
        >
          ลบ
        </button>
      </div>
    </li>
  )
}

export default TopicItem