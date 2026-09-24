function AboutPage() {
  return (
    <section className="page-section">
      <div className="section-heading">
        <h1>เกี่ยวกับรายวิชา</h1>
        <p>
          รายวิชา 4123307 การพัฒนาเว็บแอปพลิเคชัน มุ่งเน้นให้นักศึกษาเข้าใจ
          กระบวนการออกแบบและพัฒนาเว็บแอปพลิเคชันสมัยใหม่
        </p>
      </div>

      <div className="info-grid">
        <article className="info-card">
          <h2>แนวคิดหลัก</h2>
          <p>
            เรียนรู้ตั้งแต่พื้นฐานเว็บ เว็บเซิร์ฟเวอร์ เว็บบราวเซอร์
            HTML, CSS, JavaScript, React, API และฐานข้อมูล
          </p>
        </article>

        <article className="info-card">
          <h2>รูปแบบการเรียนรู้</h2>
          <p>
            เน้นการเรียนรู้แบบลงมือปฏิบัติจริง ผ่าน Lab รายบท
            และโครงงานพัฒนาเว็บแอปพลิเคชัน
          </p>
        </article>

        <article className="info-card">
          <h2>ผลลัพธ์ที่คาดหวัง</h2>
          <p>
            นักศึกษาสามารถออกแบบ พัฒนา ทดสอบ และนำเสนอเว็บแอปพลิเคชัน
            ที่ตอบโจทย์ผู้ใช้ได้
          </p>
        </article>
      </div>
    </section>
  )
}

export default AboutPage