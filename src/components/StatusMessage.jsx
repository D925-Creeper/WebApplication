function StatusMessage({ type, message, onClear }) {
  if (!message) {
    return null
  }
  return (
    <div className={`status-message ${type}`}>
      <span>{message}</span>
      {onClear && (
        <button type="button" className="clear-msg-btn" onClick={onClear}>
          ✕
        </button>
      )}
    </div>
  )
}

export default StatusMessage