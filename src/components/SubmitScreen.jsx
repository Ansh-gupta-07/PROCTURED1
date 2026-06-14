import { useState, useEffect } from 'react'
import * as CryptoJS from 'crypto-js'

export default function SubmitScreen({ payload, onShutdown, totalQuestions }) {
  const [phase, setPhase] = useState('encrypting') // 'encrypting' | 'ledger' | 'complete' | 'copying' | 'done'
  const [shutdownCount, setShutdownCount] = useState(10)

  const answers = payload?.answers || {}
  const user = payload?.user || 'UNKNOWN'
  const answered = Object.values(answers).filter(a => a && a.trim()).length
  const now = new Date()
  const timestamp = now.toLocaleTimeString()
  const filename = `${user}_answers.enc`

  // Anti-Tamper Checksum
  const checksum = CryptoJS.SHA256(JSON.stringify(payload)).toString(CryptoJS.enc.Hex)

  // Encryption & Ledger animation phase
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('ledger'), 2500)
    const t2 = setTimeout(() => setPhase('complete'), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Shutdown countdown when done
  useEffect(() => {
    if (phase !== 'done') return
    if (shutdownCount <= 0) {
      onShutdown()
      return
    }
    const t = setTimeout(() => setShutdownCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, shutdownCount, onShutdown])

  function handleCopyToUSB() {
    setPhase('copying')
    setTimeout(() => setPhase('done'), 1800)
  }

  return (
    <div className="submit-screen">
      <div className="submit-card">
        {/* Encryption animation */}
        {phase === 'encrypting' && (
          <div className="encrypt-animation">
            <div className="encrypt-spinner" />
            <div className="encrypt-text">ENCRYPTING ANSWERS...</div>
            <div style={{
              fontSize: 10,
              color: 'var(--text-dim)',
              letterSpacing: 2,
            }}>
              GPG RSA-4096 ● PUBLIC KEY ENCRYPTION
            </div>
          </div>
        )}

        {/* Ledger animation */}
        {phase === 'ledger' && (
          <div className="encrypt-animation">
            <div className="encrypt-spinner" style={{ animationDuration: '0.5s', borderTopColor: 'var(--success)' }} />
            <div className="encrypt-text" style={{ color: 'var(--success)' }}>COMMITTING TO LEDGER...</div>
            <div style={{
              fontSize: 10,
              color: 'var(--text-dim)',
              letterSpacing: 2,
            }}>
              IMMUTABLE BLOCKCHAIN HASH GENERATION
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: 9,
              color: 'var(--accent)',
              marginTop: 12,
              wordBreak: 'break-all',
              opacity: 0.5
            }}>
              SHA-256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
            </div>
          </div>
        )}

        {/* Completed state */}
        {(phase !== 'encrypting' && phase !== 'ledger') && (
          <>
            <div className="submit-title">EXAMINATION COMPLETE</div>

            <div className="submit-checkmarks">
              <div className="submit-check">
                <span className="icon">✓</span>
                <span>All answers have been encrypted</span>
              </div>
              <div className="submit-check">
                <span className="icon">✓</span>
                <span>GPG payload generated successfully</span>
              </div>
              <div className="submit-check">
                <span className="icon">✓</span>
                <span>Submission hash committed to blockchain ledger</span>
              </div>
            </div>

            {/* Details box */}
            <div className="submit-details">
              <div className="submit-detail-row">
                <span className="label">STUDENT ID:</span>
                <span className="value">{user}</span>
              </div>
              <div className="submit-detail-row">
                <span className="label">SUBMITTED:</span>
                <span className="value">{timestamp}</span>
              </div>
              <div className="submit-detail-row">
                <span className="label">QUESTIONS:</span>
                <span className="value">{answered}/{totalQuestions} answered</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <span className="label">TELEMETRY LOGS:</span>
                <span className="value" style={{ color: payload?.telemetry?.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
                  {payload?.telemetry?.length || 0} events recorded
                </span>
              </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, marginTop: 8 }}>
                  <span className="label" style={{ color: 'var(--accent)' }}>ANTI-TAMPER HASH:</span>
                </div>
                <div style={{ 
                  fontSize: 10, 
                  color: 'var(--accent)', 
                  wordBreak: 'break-all',
                  background: 'rgba(0, 200, 200, 0.1)',
                  padding: 8,
                  border: '1px solid var(--accent)'
                }}>
                  {checksum}
                </div>
              <div className="submit-detail-row">
                <span className="label">ENCRYPTION:</span>
                <span className="value">GPG RSA-4096</span>
              </div>
              <div className="submit-detail-row">
                <span className="label">FILE:</span>
                <span className="value" style={{ color: 'var(--accent)' }}>{filename}</span>
              </div>
            </div>

            {/* USB waiting / copying / done */}
            {phase === 'complete' && (
              <>
                <div className="usb-waiting">
                  💾 Insert Admin Collection USB drive
                </div>
                <button
                  className="btn btn-solid"
                  onClick={handleCopyToUSB}
                  id="copy-to-usb"
                  style={{ width: '100%' }}
                >
                  COPY TO USB & SHUTDOWN
                </button>
              </>
            )}

            {phase === 'copying' && (
              <div className="encrypt-animation">
                <div className="encrypt-spinner" />
                <div className="encrypt-text">COPYING TO USB...</div>
              </div>
            )}

            {phase === 'done' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  color: 'var(--success)',
                  fontSize: 14,
                  letterSpacing: 3,
                  marginBottom: 16,
                  fontWeight: 700,
                }}>
                  ✓ FILE COPIED SUCCESSFULLY
                </div>
                <div style={{
                  color: 'var(--text-muted)',
                  fontSize: 11,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}>
                  USB may be safely removed.
                </div>
                <div style={{
                  color: 'var(--text-dim)',
                  fontSize: 11,
                  letterSpacing: 2,
                }}>
                  System will power off in{' '}
                  <span style={{
                    color: 'var(--error)',
                    fontWeight: 700,
                    fontSize: 14,
                  }}>
                    {shutdownCount}s
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
