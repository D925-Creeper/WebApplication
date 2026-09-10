function LearningItem({ item, onToggleComplete, onDeleteLearning }) {
  return (
    <article className={`learning-item ${item.completed ? "completed" : ""}`}>
      <div className="learning-content">
        <div className="learning-header">
          <h3>{item.title}</h3>
          <span className={`priority-badge priority-${item.priority}`}>
            {item.priority}
          </span>
        </div>
        <p><strong>หมวดหมู่:</strong> {item.category}</p>
        <p><strong>วันที่บันทึก:</strong> {item.createdAt}</p>
        <p>
          <strong>สถานะ:</strong>{" "}
          <span className={item.completed ? "status-done" : "status-pending"}>
            {item.completed ? "เรียนรู้แล้ว" : "ยังไม่เสร็จ"}
          </span>
        </p>
      </div>

      <div className="item-actions">
        <button onClick={() => onToggleComplete(item.id)}>
          {item.completed ? "ยกเลิกสถานะ" : "เรียนแล้ว"}
        </button>
        <button
          className="danger"
          onClick={() => onDeleteLearning(item.id)}
        >
          ลบ
        </button>
      </div>
    </article>
  )
}

export default LearningItem