function ActivityTable({ activities }) {
  return (
    <section id="activities" className="section">
      <div className="section-heading">
        <h2>ตารางกิจกรรมการเรียนรู้</h2>
        <p>ตัวอย่างการออกแบบตารางให้ใช้งานได้บนหน้าจอขนาดเล็ก</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>สัปดาห์</th>
              <th>หัวข้อ</th>
              <th>กิจกรรม</th>
              <th>ผลลัพธ์</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.week}</td>
                <td>{activity.topic}</td>
                <td>{activity.activity}</td>
                <td>{activity.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ActivityTable