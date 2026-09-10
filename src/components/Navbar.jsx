function Navbar({ darkMode, onToggleDarkMode }) {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <a href="#overview">ภาพรวม</a>
        <a href="#courses">รายวิชา</a>
        <a href="#activities">กิจกรรม</a>
        <a href="#summary">สรุป</a>
      </div>
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleDarkMode}
        aria-label="สลับโหมดมืดสว่าง"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </nav>
  )
}

export default Navbar