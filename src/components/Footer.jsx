
function Footer({ studentName, studentId }) {
  return (
    <footer className="footer">
      <p>Lab 6: JSX, Props และการแสดงผลข้อมูลใน React</p>
      <p>จัดทำโดย {studentName} รหัสนักศึกษา {studentId}</p>
    </footer>
  )
}

export default Footer
