function SearchBox({ searchText, onSearchChange, selectedLevel, onLevelChange }) {
  return (
    <section className="search-box">
      <div>
        <h2>ค้นหารายวิชา</h2>
        <p>พิมพ์คำค้นหา เช่น React, Database, Backend หรือ UI</p>
      </div>
      <div className="search-control">
        <div className="input-group">
          <input
            type="text"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="ค้นหารายวิชาหรือหมวดหมู่..."
            aria-label="ค้นหารายวิชา"
          />
          {searchText && (
            <button
              type="button"
              className="btn-clear"
              onClick={() => onSearchChange("")}
              aria-label="ล้างคำค้นหา"
            >
              ล้าง
            </button>
          )}
        </div>
        <select
          value={selectedLevel}
          onChange={(event) => onLevelChange(event.target.value)}
          aria-label="กรองตามระดับ"
        >
          <option value="All">ทุกระดับ (All Levels)</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
    </section>
  )
}

export default SearchBox