function RegisterItem({ register, index, onDeleteRegister }) {
  const handleDelete = () => {
    if (window.confirm(`ยืนยันการลบข้อมูลของ ${register.fullName} หรือไม่?`)) {
      onDeleteRegister(register.id)
    }
  }

  return (
    <article className="register-item">
      <div className="register-header">
        <h3>
          #{index + 1} {register.fullName}
        </h3>
        <span className={`skill-badge ${register.skillLevel.toLowerCase()}`}>
          {register.skillLevel}
        </span>
      </div>
      <div className="register-detail">
        <p><strong>รหัสนักศึกษา:</strong> {register.studentId}</p>
        <p><strong>อีเมล:</strong> {register.email}</p>
        <p><strong>ชั้นปี:</strong> {register.year}</p>
        <p><strong>หัวข้อที่สนใจ:</strong> {register.topic}</p>
        <p><strong>เป้าหมาย:</strong> {register.learningGoal}</p>
      </div>
      <button className="danger" onClick={handleDelete}>
        ลบข้อมูล
      </button>
    </article>
  )
}

export default RegisterItem