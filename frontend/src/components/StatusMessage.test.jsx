import { render, screen } from "@testing-library/react"
import { describe, test, expect } from "vitest"
import StatusMessage from "./StatusMessage"

describe("StatusMessage Component", () => {
  test("แสดงข้อความเมื่อมี message", () => {
    render(<StatusMessage type="success" message="บันทึกข้อมูลสำเร็จ" />)
    expect(screen.getByText("บันทึกข้อมูลสำเร็จ")).toBeInTheDocument()
  })

  test("ไม่แสดงผลเมื่อ message เป็นค่าว่าง", () => {
    const { container } = render(<StatusMessage type="success" message="" />)
    expect(container).toBeEmptyDOMElement()
  })

  test("มี class ตาม type ที่ส่งเข้ามา", () => {
    render(<StatusMessage type="error" message="เกิดข้อผิดพลาด" />)
    const element = screen.getByText("เกิดข้อผิดพลาด")
    expect(element).toHaveClass("status-message")
    expect(element).toHaveClass("error")
  })
})