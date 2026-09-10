import LearningItem from "./LearningItem"

function LearningList({ learnings, onToggleComplete, onDeleteLearning }) {
  return (
    <section className="learning-list-section">
      {learnings.length === 0 ? (
        <p className="empty-message">ยังไม่มีหัวข้อการเรียนรู้ กรุณาเพิ่มหัวข้อใหม่</p>
      ) : (
        <div className="learning-list">
          {learnings.map((item) => (
            <LearningItem
              key={item.id}
              item={item}
              onToggleComplete={onToggleComplete}
              onDeleteLearning={onDeleteLearning}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default LearningList