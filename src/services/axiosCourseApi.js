import axios from "axios"

const API_URL = "https://jsonplaceholder.typicode.com/posts"

export async function fetchPostsWithAxios() {
  const response = await axios.get(`${API_URL}?_limit=6`)
  return response.data.map((post) => ({
    id: post.id,
    code: `AXIOS-${post.id}`,
    name: post.title,
    englishName: "Data from Axios API",
    credit: "API",
    category: "External API",
    source: "Axios"
  }))
}

export async function createPostWithAxios(courseData) {
  const response = await axios.post(API_URL, courseData)
  return {
    id: response.data.id || Date.now(),
    ...courseData,
    source: "Axios POST"
  }
}