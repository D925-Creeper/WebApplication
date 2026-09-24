const API_URL = "https://jsonplaceholder.typicode.com/posts"

export async function fetchPostsWithFetch() {
  const response = await fetch(`${API_URL}?_limit=6`)
  if (!response.ok) {
    throw new Error("ไม่สามารถโหลดข้อมูลจาก API ได้")
  }
  const data = await response.json()
  return data.map((post) => ({
    id: post.id,
    code: `API-${post.id}`,
    name: post.title,
    englishName: "Data from Fetch API",
    credit: "API",
    category: "External API",
    source: "Fetch"
  }))
}

export async function createPostWithFetch(courseData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(courseData)
  })
  if (!response.ok) {
    throw new Error("ไม่สามารถส่งข้อมูลไปยัง API ได้")
  }
  const data = await response.json()
  return {
    id: data.id || Date.now(),
    ...courseData,
    source: "Fetch POST"
  }
}