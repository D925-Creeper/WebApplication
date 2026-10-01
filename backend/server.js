import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import courseRoutes from "./routes/courseRoutes.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => res.json({ message: "Lab 13 Backend API is running" }))
app.get("/api/health", (req, res) => res.json({ status: "ok", service: "Lab 13 Course API" }))
app.use("/api/courses", courseRoutes)
app.use((req, res) => res.status(404).json({ message: "ไม่พบเส้นทาง API ที่ต้องการ" }))

app.listen(PORT, () => console.log(`Backend server is running on http://localhost:${PORT}`))