function ApiInfo() {
  return (
    <section className="api-info">
      <article>
        <h3>GET</h3>
        <p>ใช้สำหรับอ่านข้อมูลจาก API เช่น โหลดรายการรายวิชา</p>
      </article>
      <article>
        <h3>POST</h3>
        <p>ใช้สำหรับส่งข้อมูลใหม่ไปยัง API เช่น เพิ่มรายวิชา</p>
      </article>
      <article>
        <h3>JSON</h3>
        <p>รูปแบบข้อมูลที่นิยมใช้ในการรับส่งข้อมูลระหว่าง Frontend และ Backend</p>
      </article>
      <article>
        <h3>Status</h3>
        <p>ใช้ตรวจสอบผลลัพธ์ของ Request เช่น สำเร็จหรือเกิดข้อผิดพลาด</p>
      </article>
    </section>
  )
}

export default ApiInfo