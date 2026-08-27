import { useState } from "react"

function ProgressCounter() {
  const [score, setScore] = useState(0)

  const increaseScore = () => {
    if (score < 100) setScore(score + 10)
  }

  const decreaseScore = () => {
    if (score > 0) setScore(score - 10)
  }

  const resetScore = () => {
    setScore(0)
  }

  return (
    <section className="card">
      <h2>ระดับความก้าวหน้าในการเรียนรู้</h2>
      <div className="score-display">
        <span>{score}</span>
        <p>คะแนนความก้าวหน้า</p>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="button-group">
        <button onClick={decreaseScore} disabled={score === 0}>
          ลดคะแนน
        </button>
        <button onClick={increaseScore} disabled={score === 100}>
          เพิ่มคะแนน
        </button>
        <button className="secondary" onClick={resetScore}>
          รีเซ็ต
        </button>
      </div>
      {score === 100 && (
        <p className="success-message">
          ยอดเยี่ยม! คุณทำความก้าวหน้าได้ครบ 100%
        </p>
      )}
    </section>
  )
}

export default ProgressCounter