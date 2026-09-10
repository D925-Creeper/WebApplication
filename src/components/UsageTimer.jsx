import { useEffect, useState } from "react"

function UsageTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds((previousSeconds) => previousSeconds + 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  return (
    <section className="timer-box">
      <h2>เวลาที่ใช้งานระบบ</h2>
      <p>
        คุณใช้งานหน้านี้แล้ว <strong>{seconds}</strong> วินาที
      </p>
    </section>
  )
}

export default UsageTimer