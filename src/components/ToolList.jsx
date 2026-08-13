
import SectionTitle from "./SectionTitle"
import ToolBadge from "./ToolBadge"

function ToolList({ tools }) {
  return (
    <section className="section">
      <SectionTitle
        title="เครื่องมือที่ใช้ในการพัฒนา"
        description="แสดงรายการเครื่องมือโดยรับข้อมูลผ่าน Props"
      />
      <div className="tool-list">
        {tools.map((tool) => (
          <ToolBadge
            key={tool.id}
            name={tool.name}
            type={tool.type}
          />
        ))}
      </div>
    </section>
  )
}

export default ToolList
