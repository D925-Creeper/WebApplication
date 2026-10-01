const API_BASE_URL = import.meta.env.VITE_API_URL

export async function getCourses() {
  const response = await fetch(`${API_BASE_URL}/courses`)
  if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลรายวิชาได้")
  return await response.json()
}

export async function createCourse(courseData) {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "ไม่สามารถเพิ่มข้อมูลรายวิชาได้")
  }
  return await response.json()
}

export async function updateCourse(id, courseData) {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "ไม่สามารถแก้ไขข้อมูลรายวิชาได้")
  }
  return await response.json()
}

export async function deleteCourse(id) {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, { method: "DELETE" })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "ไม่สามารถลบข้อมูลรายวิชาได้")
  }
  return await response.json()
}