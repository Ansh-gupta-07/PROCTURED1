import { useState, useEffect } from 'react'
import { EXAM_CONFIG } from '../data/questions'

const GENERAL_RULES = [
  "This examination is conducted under the strict supervision of HOPE OS Secure Kiosk.",
  "Read each question carefully before attempting your answer.",
  "All answers are auto-saved every 30 seconds. You may also save manually.",
  "Do not attempt to power off, restart, or tamper with the system.",
  "Any form of malpractice will result in immediate disqualification.",
  "The examination timer starts immediately upon clicking BEGIN EXAMINATION.",
  "You may navigate between questions freely using the question navigator.",
  "Ensure all questions are attempted before the timer expires.",
  "Once the time expires, answers will be auto-submitted and encrypted.",
]

const MARKING_SCHEME = [
  { item: "Total Questions", value: "5" },
  { item: "Total Marks", value: "100" },
  { item: "Marks per Question", value: "20" },
  { item: "Negative Marking", value: "None" },
  { item: "Question Type", value: "Long Answer (Descriptive)" },
  { item: "Duration", value: "3 Hours (180 Minutes)" },
  { item: "Passing Marks", value: "40 / 100 (40%)" },
]

const SECURITY_NOTICES = [
  "Your screen is being monitored — captures are recorded every 60 seconds.",
  "All keystrokes and activity are logged for audit purposes.",
  "Network access is fully disabled — no internet connectivity.",
  "Answers are encrypted with GPG RSA-4096 public key encryption.",
  "USB ports are restricted — only admin collection USB is permitted.",
]

const DECLARATION_TEXT = `I hereby declare that I am the rightful candidate appearing for this examination. I understand that this examination is being conducted under secure, monitored conditions. I agree to abide by all rules and regulations set forth by the examination authority. I acknowledge that any attempt at malpractice, impersonation, or system tampering will result in immediate disqualification and may attract further disciplinary or legal action. I confirm that I have read, understood, and accepted all examination instructions, the marking scheme, and the security policies stated above.`

export default function InstructionsScreen({ onBegin }) {
  const [countdown, setCountdown] = useState(420)
  const [agreed, setAgreed] = useState(false)
  const [activeTab, setActiveTab] = useState('rules') // 'rules' | 'marking' | 'security'

  useEffect(() => {
    if (countdown <= 0) {
      onBegin()
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, onBegin])

  const tabs = [
    { id: 'rules', label: 'GENERAL RULES' },
    { id: 'marking', label: 'MARKING SCHEME' },
    { id: 'security', label: 'SECURITY POLICY' },
  ]

  return (
    <div className="instructions-screen">
      <div className="instructions-card" style={{ width: 780, maxHeight: '85vh', overflow: 'auto' }}>
        {/* Title */}
        <h2 className="instructions-title">EXAMINATION BRIEFING</h2>

        {/* Exam info bar */}
        <div style={{
          display: 'flex',
          gap: 16,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'SUBJECT', value: EXAM_CONFIG.subject },
            { label: 'SET', value: EXAM_CONFIG.set },
            { label: 'DURATION', value: '3 Hours' },
            { label: 'TOTAL MARKS', value: EXAM_CONFIG.total_marks },
          ].map((info, i) => (
            <div key={i} style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid var(--border)',
              padding: '8px 16px',
              flex: '1 1 auto',
              minWidth: 120,
            }}>
              <div style={{
                fontSize: 8,
                letterSpacing: 3,
                color: 'var(--text-dim)',
                marginBottom: 4,
              }}>
                {info.label}
              </div>
              <div style={{
                fontSize: 12,
                color: 'var(--accent)',
                fontWeight: 600,
                letterSpacing: 1,
              }}>
                {info.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tab navigation */}
        <div style={{
          display: 'flex',
          gap: 0,
          marginBottom: 0,
          borderBottom: '1px solid var(--border)',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                padding: '10px 20px',
                fontSize: 10,
                letterSpacing: 3,
                fontWeight: activeTab === tab.id ? 700 : 400,
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                background: activeTab === tab.id ? 'rgba(0,200,200,0.06)' : 'transparent',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ minHeight: 220 }}>
          {/* General Rules */}
          {activeTab === 'rules' && (
            <div className="rules-box" style={{ marginTop: 20 }}>
              {GENERAL_RULES.map((rule, i) => (
                <div key={i} className="rule-item">
                  <span className="rule-num">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          )}

          {/* Marking Scheme */}
          {activeTab === 'marking' && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--accent-faint)',
                borderLeft: '3px solid var(--accent)',
              }}>
                {/* Table header */}
                <div style={{
                  display: 'flex',
                  padding: '12px 24px',
                  borderBottom: '1px solid var(--border)',
                  background: 'rgba(0,200,200,0.04)',
                }}>
                  <div style={{
                    flex: 1,
                    fontSize: 9,
                    letterSpacing: 4,
                    color: 'var(--accent)',
                    fontWeight: 700,
                  }}>
                    PARAMETER
                  </div>
                  <div style={{
                    width: 220,
                    fontSize: 9,
                    letterSpacing: 4,
                    color: 'var(--accent)',
                    fontWeight: 700,
                    textAlign: 'right',
                  }}>
                    VALUE
                  </div>
                </div>

                {/* Table rows */}
                {MARKING_SCHEME.map((row, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    padding: '11px 24px',
                    borderBottom: i < MARKING_SCHEME.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                    transition: 'background 0.15s',
                  }}>
                    <div style={{
                      flex: 1,
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      letterSpacing: 1,
                    }}>
                      {row.item}
                    </div>
                    <div style={{
                      width: 220,
                      fontSize: 12,
                      color: 'var(--text)',
                      fontWeight: 500,
                      textAlign: 'right',
                      letterSpacing: 1,
                    }}>
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional note */}
              <div style={{
                marginTop: 14,
                padding: '10px 16px',
                fontSize: 10,
                color: 'var(--text-dim)',
                letterSpacing: 1,
                lineHeight: 1.8,
                borderLeft: '2px solid var(--text-dim)',
              }}>
                ▸ There is <span style={{ color: 'var(--success)' }}>NO negative marking</span> in this examination.
                <br />
                ▸ All questions carry <span style={{ color: 'var(--accent)' }}>equal marks (20 each)</span>.
                <br />
                ▸ Answer all questions. Partial credit may be awarded for incomplete answers.
              </div>
            </div>
          )}

          {/* Security Policy */}
          {activeTab === 'security' && (
            <div className="rules-box" style={{ marginTop: 20, borderLeftColor: 'var(--error)' }}>
              {SECURITY_NOTICES.map((notice, i) => (
                <div key={i} className="rule-item">
                  <span className="rule-num" style={{ color: 'var(--error)', opacity: 1 }}>
                    ⚠
                  </span>
                  <span>{notice}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monitor notice */}
        <div className="monitor-notice" style={{ marginTop: 20 }}>
          <span className="icon">🔒</span>
          <span>Screen monitoring is active — all activity is being recorded</span>
        </div>

        {/* Countdown */}
        <div className="countdown-text">
          Session will auto-begin in{' '}
          <span className="countdown-value">{Math.floor(countdown / 60)}m {String(countdown % 60).padStart(2, '0')}s</span>
        </div>

        {/* ─── Declaration Section ──────────────────────────── */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border)',
          padding: '20px 24px',
          marginBottom: 24,
        }}>
          <div style={{
            fontSize: 10,
            letterSpacing: 4,
            color: 'var(--accent)',
            fontWeight: 700,
            marginBottom: 14,
            paddingBottom: 10,
            borderBottom: '1px solid var(--border)',
          }}>
            ◈ STUDENT DECLARATION
          </div>
          <p style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            lineHeight: 2,
            letterSpacing: 0.3,
            textAlign: 'justify',
          }}>
            {DECLARATION_TEXT}
          </p>
        </div>

        {/* Agreement checkbox */}
        <div className="agree-row" onClick={() => setAgreed(!agreed)}>
          <div className={`agree-checkbox ${agreed ? 'checked' : ''}`} />
          <span className="agree-label">
            I have read and understood the examination instructions, marking scheme, security
            policy, and the declaration above. I agree to abide by all rules and accept
            full responsibility.
          </span>
        </div>

        {/* Begin button */}
        <button
          className="btn btn-solid"
          onClick={onBegin}
          disabled={!agreed}
          id="begin-exam"
          style={{ width: '100%' }}
        >
          ▶ BEGIN EXAMINATION
        </button>
      </div>
    </div>
  )
}
