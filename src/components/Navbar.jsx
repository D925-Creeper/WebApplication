import { NavLink } from "react-router"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <span>Course Portal</span>
      </div>
      <div className="nav-links">
        <NavLink to="/" end>
          หน้าแรก
        </NavLink>
        <NavLink to="/courses">
          รายวิชา
        </NavLink>
        <NavLink to="/about">
          เกี่ยวกับ
        </NavLink>
        <NavLink to="/contact">
          ติดต่อ
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar