import { useState, useEffect } from 'react'

export default function BottomBar({ answers, autoSaveActive, totalQuestions }) {
  const answered = Object.values(answers).filter(a => a && a.trim()).length

  const [aiStatusIdx, setAiStatusIdx] = useState(0)
  const aiStatuses = [
    { label: "AI VISION", value: "TRACKING GAZE", color: "var(--success)" },
    { label: "AI AUDIO", value: "ANALYZING AMBIENT", color: "var(--success)" },
    { label: "HEURISTICS", value: "KEYSTROKES NORMAL", color: "var(--success)" },
    { label: "IDENTITY", value: "BIOMETRIC MATCH", color: "var(--success)" }
  ]

  useEffect(() => {
    const t = setInterval(() => {
      setAiStatusIdx(i => (i + 1) % aiStatuses.length)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="bottom-bar">
      <div className="bottom-indicator">
        <div className={`dot ${autoSaveActive ? 'green' : 'yellow'}`} />
        <span className="label">AUTO-SAVE:</span>
        <span className="value" style={{
          color: autoSaveActive ? 'var(--success)' : 'var(--warning)',
        }}>
          {autoSaveActive ? 'ACTIVE' : 'PAUSED'}
        </span>
      </div>

      <div className="bottom-indicator">
        <div className="dot teal" />
        <span className="label">GPG:</span>
        <span className="value" style={{ color: 'var(--accent)' }}>ARMED</span>
      </div>

      <div className="bottom-indicator">
        <div className="dot teal" />
        <span className="label">ENCRYPTION:</span>
        <span className="value" style={{ color: 'var(--accent)' }}>AES-256-GCM</span>
      </div>

      <div className="bottom-indicator">
        <div className="dot green" />
        <span className="label">ANSWERED:</span>
        <span className="value">{answered}/{totalQuestions}</span>
      </div>

      <div style={{ marginLeft: 'auto' }}>
        <div className="bottom-indicator">
          <div className="dot green" />
          <span className="label">{aiStatuses[aiStatusIdx].label}:</span>
          <span className="value" style={{ color: aiStatuses[aiStatusIdx].color }}>
            {aiStatuses[aiStatusIdx].value}
          </span>
        </div>
      </div>
    </div>
  )
}
