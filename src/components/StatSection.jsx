import StatCard from "./StatCard"

function StatSection({ stats }) {
  return (
    <section id="overview" className="section">
      <div className="section-heading">
        <h2>ภาพรวมรายวิชา</h2>
        <p>ข้อมูลสรุปสำหรับการเรียนรู้และการพัฒนาเว็บแอปพลิเคชัน</p>
      </div>
      <div className="stat-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>
    </section>
  )
}

export default StatSection