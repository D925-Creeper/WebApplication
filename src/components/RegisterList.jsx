import RegisterItem from "./RegisterItem"

function RegisterList({ registers, onDeleteRegister }) {
  return (
    <section className="card">
      <h2>รายการลงทะเบียนความสนใจ</h2>
      {registers.length === 0 ? (
        <p className="empty-message">ยังไม่มีข้อมูลการลงทะเบียน</p>
      ) : (
        <div className="register-list">
          {registers.map((register, index) => (
            <RegisterItem
              key={register.id}
              index={index}
              register={register}
              onDeleteRegister={onDeleteRegister}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default RegisterList