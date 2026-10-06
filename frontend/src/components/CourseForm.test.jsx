import { render, screen, fireEvent } from "@testing-library/react"
import { describe, test, expect, vi } from "vitest"
import CourseForm from "./CourseForm"

describe("CourseForm Component", () => {
  test("แสดงหัวข้อเพิ่มข้อมูลรายวิชาเมื่อไม่ได้แก้ไข", () => {
    render(
      <CourseForm
        onSubmitCourse={() => {}}
        editingCourse={null}
        onCancelEdit={() => {}}
        submitting={false}
      />
    )
    expect(screen.getByText("เพิ่มข้อมูลรายวิชา")).toBeInTheDocument()
  })

  test("แสดง Error เมื่อ Submit โดยไม่กรอกรหัสวิชา", () => {
    render(
      <CourseForm
        onSubmitCourse={() => {}}
        editingCourse={null}
        onCancelEdit={() => {}}
        submitting={false}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "เพิ่มรายวิชา" }))
    expect(screen.getByText("กรุณากรอกรหัสวิชา")).toBeInTheDocument()
  })

  test("เรียกใช้ onSubmitCourse เมื่อกรอกข้อมูลครบ", () => {
    const mockSubmit = vi.fn()
    render(
      <CourseForm
        onSubmitCourse={mockSubmit}
        editingCourse={null}
        onCancelEdit={() => {}}
        submitting={false}
      />
    )
    fireEvent.change(screen.getByLabelText("รหัสวิชา"), {
      target: { value: "4123307" }
    })
    fireEvent.change(screen.getByLabelText("ชื่อวิชาภาษาไทย"), {
      target: { value: "การพัฒนาเว็บแอปพลิเคชัน" }
    })
    fireEvent.change(screen.getByLabelText("ชื่อวิชาภาษาอังกฤษ"), {
      target: { value: "Web Application Development" }
    })
    fireEvent.click(screen.getByRole("button", { name: "เพิ่มรายวิชา" }))
    expect(mockSubmit).toHaveBeenCalledTimes(1)
  })
})