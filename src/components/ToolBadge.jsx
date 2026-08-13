
function ToolBadge({ name, type }) {
  return (
    <div className={`tool-badge ${type}`}>
      {name}
    </div>
  )
}

export default ToolBadge
