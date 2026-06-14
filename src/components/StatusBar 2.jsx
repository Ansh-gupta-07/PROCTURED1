export default function StatusBar({
  user,
  assignedSetId,
  timer,
  timerWarning,
  onExport,
  onLog,
  screen,
}) {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="status-bar">
      {/* Left side */}
      <div className="status-bar-left">
        <div className="status-logo">◈ HOPE OS</div>
        <div className="status-secure">
          <div className="status-dot" />
          <span>SYSTEM SECURE {assignedSetId ? `| ${assignedSetId}` : ''}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="status-bar-right">
        <div className="status-user">
          SESSION: <span>{user}</span>
        </div>

        {screen === 'exam' && timer !== null && (
          <div className={`status-timer ${timerWarning ? 'warning' : ''}`}>
            {formatTime(timer)}
          </div>
        )}

        {screen === 'exam' && (
          <>
            <button className="btn btn-accent" onClick={onExport} id="export-csv">
              EXPORT CSV
            </button>
            <button className="btn btn-ghost" onClick={onLog} id="proctor-log">
              [LOG]
            </button>
          </>
        )}

        <span style={{
          fontSize: 11,
          color: 'var(--accent)',
          fontWeight: 500,
          letterSpacing: 1,
        }}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}
