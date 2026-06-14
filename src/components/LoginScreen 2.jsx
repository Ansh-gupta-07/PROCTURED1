import { useState, useRef, useEffect } from 'react'
import { VALID_STUDENTS } from '../data/students'

export default function LoginScreen({ onLogin, onAdminClick }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [strikes, setStrikes] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [lockout, setLockout] = useState(0)
  const usernameRef = useRef(null)

  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  // Lockout countdown
  useEffect(() => {
    if (lockout <= 0) return
    const t = setInterval(() => {
      setLockout(prev => {
        if (prev <= 1) {
          setStrikes(0)
          setError('')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [lockout])

  function handleLogin() {
    if (lockout > 0) return

    if (!username.trim() || !password.trim()) {
      setError('ACCESS DENIED: credentials required')
      triggerShake()
      return
    }

    // Verify credentials
    const student = VALID_STUDENTS[username.trim()]
    if (student && student.password === password) {
      onLogin(username.trim())
    } else {
      const newStrikes = strikes + 1
      setStrikes(newStrikes)
      if (newStrikes >= 3) {
        setLockout(300) // 5 minute lockout
        setError(`ACCESS DENIED: ACCOUNT LOCKED FOR 5 MINUTES`)
      } else {
        setError(`ACCESS DENIED: invalid credentials [${newStrikes}/3]`)
        triggerShake()
      }
    }
  }

  function triggerShake() {
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin()
  }

  const lockoutMinutes = Math.floor(lockout / 60)
  const lockoutSeconds = lockout % 60

  return (
    <div className="login-screen">
      {/* CRT scanline overlay */}
      <div className="crt-overlay" />
      <div className="crt-scan" />

      {/* Login card */}
      <div className={`login-card ${shaking ? 'shake' : ''}`}>
        {/* Title */}
        <div className="login-title">
          <h1 onDoubleClick={onAdminClick} style={{ cursor: 'pointer' }}>HOPE OS</h1>
          <p>[ SECURE KIOSK ENVIRONMENT ]</p>
        </div>

        {/* Username field */}
        <div className="login-field">
          <label>▸ USERNAME</label>
          <input
            ref={usernameRef}
            className="login-input"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={lockout > 0}
            autoComplete="off"
            id="login-username"
          />
        </div>

        {/* Password field */}
        <div className="login-field" style={{ marginBottom: 36 }}>
          <label>▸ PASSWORD</label>
          <input
            className="login-input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={lockout > 0}
            id="login-password"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="login-error">
            ✗ {error}
          </div>
        )}

        {/* Lockout message */}
        {lockout > 0 && (
          <div className="login-error" style={{ borderColor: 'rgba(226, 85, 85, 0.4)' }}>
            🔒 SYSTEM LOCKED — Too many failed attempts
            <br />
            Retry in: {lockoutMinutes}:{lockoutSeconds.toString().padStart(2, '0')}
          </div>
        )}

        {/* Authenticate button */}
        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={lockout > 0}
          id="login-submit"
        >
          ▶ AUTHENTICATE
        </button>

        {/* Strike counter */}
        {strikes > 0 && strikes < 3 && (
          <div style={{
            textAlign: 'center',
            marginTop: 16,
            fontSize: 10,
            color: 'var(--text-dim)',
            letterSpacing: 2,
          }}>
            ATTEMPTS: {strikes}/3
          </div>
        )}
      </div>
    </div>
  )
}
