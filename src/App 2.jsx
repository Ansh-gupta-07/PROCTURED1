import { useState, useEffect, useCallback, useRef } from 'react'
import BootScreen from './components/BootScreen'
import UnlockScreen from './components/UnlockScreen'
import LoginScreen from './components/LoginScreen'
import InstructionsScreen from './components/InstructionsScreen'
import ExamScreen from './components/ExamScreen'
import SubmitScreen from './components/SubmitScreen'
import StatusBar from './components/StatusBar'
import BottomBar from './components/BottomBar'
import ProctorLog from './components/ProctorLog'
import Toast from './components/Toast'
import NtaDashboard from './components/NtaDashboard'
import QUESTIONS, { EXAM_CONFIG } from './data/questions'

export default function App() {
  // ─── Screen State ─────────────────────────────────────────────
  const [screen, setScreen] = useState('boot')
  const [fadeClass, setFadeClass] = useState('screen-fade-active')

  // ─── Vault State ──────────────────────────────────────────────
  const [decryptedVault, setDecryptedVault] = useState(null)
  const [assignedSetId, setAssignedSetId] = useState(null)
  const [activeQuestions, setActiveQuestions] = useState([])
  const [submissionPayload, setSubmissionPayload] = useState(null)

  // ─── Auth State ───────────────────────────────────────────────
  const [sessionUser, setSessionUser] = useState('')

  // ─── Exam State ───────────────────────────────────────────────
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [lastSaved, setLastSaved] = useState(null)
  const [timer, setTimer] = useState(EXAM_CONFIG.duration_seconds)
  const [timerWarning, setTimerWarning] = useState(false)

  // ─── Proctor State ────────────────────────────────────────────
  const [shots, setShots] = useState([])
  const [showLog, setShowLog] = useState(false)
  const [telemetryLogs, setTelemetryLogs] = useState([])

  // ─── UI State ─────────────────────────────────────────────────
  const [toast, setToast] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [clock, setClock] = useState(new Date())

  const appRef = useRef(null)
  const timerRef = useRef(null)
  const autoSaveRef = useRef(null)

  // ─── Clock tick ───────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // ─── Screen Navigation ────────────────────────────────────────
  const navigate = useCallback((to) => {
    setFadeClass('screen-fade-enter')
    setTimeout(() => {
      setScreen(to)
      setFadeClass('screen-fade-active')
    }, 400)
  }, [])

  // ─── Toast Helper ─────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }, [])

  // ─── Exam Timer ───────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'exam') return

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          navigate('submit')
          return 0
        }
        if (prev <= 300) setTimerWarning(true)
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [screen, navigate])

  // ─── Auto-save every 30s ──────────────────────────────────────
  useEffect(() => {
    if (screen !== 'exam') return

    autoSaveRef.current = setInterval(() => {
      const t = new Date().toLocaleTimeString()
      setLastSaved(t)
      showToast(`✓ Auto-saved at ${t} — GPG encrypted`)
    }, 30000)

    return () => clearInterval(autoSaveRef.current)
  }, [screen, showToast])

  // ─── Simulated Proctoring ─────────────────────────────────────
  useEffect(() => {
    if (screen !== 'exam') return

    const interval = setInterval(() => {
      // Create a simple simulated capture (colored canvas)
      const canvas = document.createElement('canvas')
      canvas.width = 200
      canvas.height = 120
      const ctx = canvas.getContext('2d')

      // Draw a dark background with teal accents
      ctx.fillStyle = '#0A0F1E'
      ctx.fillRect(0, 0, 200, 120)
      ctx.fillStyle = '#0D1526'
      ctx.fillRect(8, 8, 75, 104)
      ctx.fillStyle = '#050A12'
      ctx.fillRect(90, 8, 102, 104)

      // Add some "UI elements"
      ctx.fillStyle = '#00C8C8'
      ctx.fillRect(12, 12, 40, 3)
      ctx.fillStyle = '#1A2540'
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(12, 24 + i * 16, 65, 10)
      }
      ctx.fillStyle = '#4A5568'
      ctx.fillRect(95, 12, 60, 3)
      ctx.fillRect(95, 24, 90, 30)

      // Timestamp
      ctx.fillStyle = '#00C8C8'
      ctx.font = '9px monospace'
      ctx.fillText(new Date().toLocaleTimeString(), 95, 110)

      const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
      const time = new Date().toLocaleTimeString()
      setShots(prev => [...prev, { dataUrl, time }])
      showToast(`📸 Screen captured at ${time}`)
    }, 60000)

    return () => clearInterval(interval)
  }, [screen, showToast])

  // ─── Keyboard shortcut blocking (simulated kiosk) ─────────────
  useEffect(() => {
    const handler = (e) => {
      if (screen !== 'boot' && screen !== 'login') {
        // Block common escape shortcuts
        if (
          (e.altKey && e.key === 'F4') ||
          (e.ctrlKey && e.altKey && e.key === 'Delete') ||
          (e.ctrlKey && e.altKey && (e.key === 't' || e.key === 'T')) ||
          e.key === 'Meta' ||
          (e.key === 'F11')
        ) {
          e.preventDefault()
          showToast('⚠ KEYBOARD SHORTCUT BLOCKED — Kiosk mode active')
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen, showToast])

  // ─── Telemetry (Focus Tracking & Idle Tracking) ────────────────
  useEffect(() => {
    if (screen !== 'exam') return

    // Focus Tracking
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const violation = `[${new Date().toLocaleTimeString()}] TAB SWITCH VIOLATION: Focus lost`
        setTelemetryLogs(prev => [...prev, violation])
        showToast('TAB SWITCH VIOLATION DETECTED', 'error')
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Idle Tracking (30s threshold for demonstration)
    let idleTimer
    const resetIdleTimer = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        const violation = `[${new Date().toLocaleTimeString()}] IDLE WARNING: No activity for 30 seconds`
        setTelemetryLogs(prev => [...prev, violation])
        showToast('IDLE WARNING LOGGED', 'warn')
      }, 30000)
    }

    window.addEventListener('mousemove', resetIdleTimer)
    window.addEventListener('keydown', resetIdleTimer)
    resetIdleTimer()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('mousemove', resetIdleTimer)
      window.removeEventListener('keydown', resetIdleTimer)
      clearTimeout(idleTimer)
    }
  }, [screen, showToast])

  // ─── Handlers ─────────────────────────────────────────────────
  function handleBootComplete() {
    navigate('unlock')
  }

  function handleUnlock(vault) {
    if (vault) setDecryptedVault(vault)
    navigate('login')
  }

  function handleLogin(user) {
    setSessionUser(user)
    
    // Assign a random set from the decrypted vault if available
    if (decryptedVault) {
      const sets = Object.keys(decryptedVault)
      const randomSet = sets[Math.floor(Math.random() * sets.length)]
      setAssignedSetId(randomSet)
      setActiveQuestions(decryptedVault[randomSet])
    }
    
    navigate('instructions')
  }

  const handleBeginExam = useCallback(() => {
    setTimer(EXAM_CONFIG.duration_seconds)
    navigate('exam')
  }, [navigate])

  function handleAnswer(index, value) {
    setAnswers(prev => ({ ...prev, [index]: value }))
  }

  function handleSave() {
    const t = new Date().toLocaleTimeString()
    setLastSaved(t)
    showToast('✓ Response saved & encrypted')
  }

  function handleSubmitClick() {
    setShowConfirm(true)
  }

  function handleSubmitConfirm() {
    setShowConfirm(false)
    clearInterval(timerRef.current)
    clearInterval(autoSaveRef.current)
    
    // Save the encrypted payload for the NTA Dashboard to decrypt later
    setSubmissionPayload({
      user: sessionUser,
      setId: assignedSetId,
      answers: answers,
      telemetry: telemetryLogs
    })
    
    navigate('submit')
  }

  function handleShutdown() {
    // In real OS: systemctl poweroff
    // In prototype: show boot screen again
    setScreen('boot')
    setSessionUser('')
    setAnswers({})
    setCurrentQ(0)
    setTimer(EXAM_CONFIG.duration_seconds)
    setTimerWarning(false)
    setLastSaved(null)
    setShots([])
  }

  function exportCSV() {
    const header = 'Question,Answer,Marks,Topic,Timestamp,StudentID'
    const rows = (activeQuestions.length ? activeQuestions : QUESTIONS).map((q, i) =>
      `"${q.text.replace(/"/g, '""')}","${(answers[i] || '').replace(/"/g, '""')}","${q.marks}","${q.topic}","${new Date().toISOString()}","${sessionUser}"`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `exam-${sessionUser}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('✓ CSV exported successfully')
  }

  // ─── Render ───────────────────────────────────────────────────
  const showStatusBar = screen !== 'boot' && screen !== 'login'
  const showBottomBar = screen === 'exam'

  return (
    <div
      ref={appRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg-main)',
        position: 'relative',
      }}
    >
      {/* Status Bar */}
      {showStatusBar && (
        <StatusBar
          user={sessionUser}
          assignedSetId={assignedSetId}
          timer={timer}
          timerWarning={timerWarning}
          onExport={exportCSV}
          onLog={() => setShowLog(v => !v)}
          screen={screen}
        />
      )}

      {/* Main Content */}
      <div
        className={`screen-fade ${fadeClass}`}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {screen === 'boot' && (
          <BootScreen onComplete={handleBootComplete} />
        )}

        {screen === 'unlock' && (
          <UnlockScreen onUnlock={handleUnlock} />
        )}

        {screen === 'login' && (
          <LoginScreen onLogin={handleLogin} onAdminClick={() => navigate('nta')} />
        )}

        {screen === 'instructions' && (
          <InstructionsScreen onBegin={handleBeginExam} />
        )}

        {screen === 'exam' && (
          <ExamScreen
            user={sessionUser}
            questions={activeQuestions}
            currentQ={currentQ}
            onSelectQuestion={setCurrentQ}
            answers={answers}
            onAnswer={handleAnswer}
            onSave={handleSave}
            lastSaved={lastSaved}
            onSubmit={handleSubmitClick}
          />
        )}

        {screen === 'submit' && (
          <SubmitScreen
            payload={submissionPayload}
            totalQuestions={activeQuestions.length}
            onShutdown={handleShutdown}
          />
        )}

        {screen === 'nta' && (
          <NtaDashboard
            payload={submissionPayload}
            vault={decryptedVault}
            onExit={() => navigate('boot')}
          />
        )}
      </div>

      {/* Bottom Bar */}
      {showBottomBar && (
        <BottomBar answers={answers} autoSaveActive={true} totalQuestions={activeQuestions.length} />
      )}

      {/* Proctor Log Overlay */}
      {showLog && (
        <ProctorLog shots={shots} onClose={() => setShowLog(false)} />
      )}

      {/* Submit Confirmation Dialog */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3>CONFIRM SUBMISSION</h3>
            <p>
              Are you sure you want to submit your examination?
              <br />
              This action cannot be undone. All answers will be
              encrypted and locked.
            </p>
            <div className="confirm-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setShowConfirm(false)}
                style={{ padding: '10px 24px' }}
              >
                CANCEL
              </button>
              <button
                className="btn btn-solid"
                onClick={handleSubmitConfirm}
                id="confirm-submit"
                style={{ padding: '10px 24px' }}
              >
                SUBMIT & ENCRYPT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast message={toast} />
    </div>
  )
}
