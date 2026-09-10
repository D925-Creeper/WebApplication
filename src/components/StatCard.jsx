function StatCard({ title, value, description, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h3>{value}</h3>
        {icon && <span className="stat-icon">{icon}</span>}
      </div>
      <p className="stat-title">{title}</p>
      <p className="stat-description">{description}</p>
    </div>
  )
}

export default StatCard