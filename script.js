const form = document.getElementById("interestForm")
const result = document.getElementById("result")

form.addEventListener("submit", function(event) {
  event.preventDefault()

  const studentName = document.getElementById("studentName").value.trim()
  const studentId = document.getElementById("studentId").value.trim()
  const interestTopic = document.getElementById("interestTopic").value

  result.className = ""

  if (studentName === "" || studentId === "" || interestTopic === "") {
    result.textContent = "กรุณากรอกข้อมูลให้ครบถ้วน"
    result.classList.add("error")
    return
  }

  result.innerHTML = `
    <strong>ลงทะเบียนความสนใจสำเร็จ</strong><br>
    ชื่อ - สกุล: ${studentName}<br>
    รหัสนักศึกษา: ${studentId}<br>
    หัวข้อที่สนใจ: ${interestTopic}
  `

  result.classList.add("success")
  form.reset()
})
