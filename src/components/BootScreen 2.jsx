import { useState, useEffect, useRef } from 'react'

const BOOT_MESSAGES = [
  { text: "Initializing HOPE OS kernel...", type: "info", delay: 0 },
  { text: "Loading secure boot modules", type: "ok", delay: 300 },
  { text: "Verifying system integrity hash", type: "ok", delay: 600 },
  { text: "GPG keyring loaded — RSA-4096", type: "ok", delay: 900 },
  { text: "Zero-Knowledge Exam Vault: LOCATED", type: "info", delay: 1300 },
  { text: "Mounting encrypted payload: questions.enc", type: "warn", delay: 1700 },
  { text: "Payload loaded to RAM — Awaiting Decryption Key...", type: "info", delay: 2100 },
  { text: "Cage kiosk compositor active", type: "ok", delay: 3400 },
  { text: "Network interfaces & USB: BLOCKED", type: "warn", delay: 3800 },
  { text: "AppArmor profile: ENFORCING", type: "ok", delay: 4200 },
  { text: "Loading examination environment...", type: "info", delay: 4600 },
  { text: "System ready — awaiting authentication", type: "info", delay: 5000 },
]

export default function BootScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [progress, setProgress] = useState(0)
  const onCompleteRef = useRef(onComplete)
  const hasCompleted = useRef(false)

  // Keep the ref up to date
  onCompleteRef.current = onComplete

  useEffect(() => {
    // Reset state for strict mode re-mounts
    setVisibleLines([])
    setProgress(0)
    hasCompleted.current = false

    const timers = BOOT_MESSAGES.map((msg, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, msg])
        setProgress(((i + 1) / BOOT_MESSAGES.length) * 100)
      }, msg.delay)
    )

    const completeTimer = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true
        onCompleteRef.current()
      }
    }, 5800)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(completeTimer)
    }
  }, []) // Empty deps — only run once on mount

  return (
    <div className="boot-screen">
      {/* CRT effect */}
      <div className="crt-overlay" />
      <div className="crt-scan" />

      {/* Logo */}
      <div className="boot-logo">HOPE OS</div>
      <div className="boot-subtitle">Secure Examination Kiosk</div>

      {/* Terminal output */}
      <div className="boot-terminal">
        {visibleLines.map((line, i) => (
          <div
            key={i}
            className="boot-line"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className={line.type}>
              {line.type === 'ok' ? '[  OK  ]' :
               line.type === 'warn' ? '[ WARN ]' : '[ .... ]'}
            </span>
            <span>{line.text}</span>
          </div>
        ))}
        {visibleLines.length > 0 && (
          <div className="boot-line" style={{ color: 'var(--accent)', marginTop: 8 }}>
            <span style={{ animation: 'pulse 1s infinite' }}>█</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="boot-progress">
        <div
          className="boot-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
