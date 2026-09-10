function SummaryBox({ learnings }) {
  const total = learnings.length
  const completed = learnings.filter((item) => item.completed).length
  const pending = total - completed
  const highPriority = learnings.filter((item) => item.priority === "สูง").length

  return (
    <section className="summary-grid">
      <div className="summary-card">
        <h3>{total}</h3>
        <p>หัวข้อทั้งหมด</p>
      </div>
      <div className="summary-card">
        <h3>{completed}</h3>
        <p>เรียนรู้แล้ว</p>
      </div>
      <div className="summary-card">
        <h3>{pending}</h3>
        <p>ยังไม่เสร็จ</p>
      </div>
      <div className="summary-card">
        <h3>{highPriority}</h3>
        <p>ความสำคัญสูง</p>
      </div>
    </section>
  )
}

export default SummaryBox