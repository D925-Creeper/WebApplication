function Footer({ studentInfo }) {
  return (
    <footer className="footer">
      <p>Lab 7: State และ Event Handling ใน React</p>
      <p>
        ผู้จัดทำ: {studentInfo?.name || "นาย ธนพัฒน์ ป้อมเย็น"} (รหัสนักศึกษา: {studentInfo?.id || "68042380112"})
      </p>
      <p>รายวิชา 4123307 การพัฒนาเว็บแอปพลิเคชัน</p>
    </footer>
  )
}

export default Footer