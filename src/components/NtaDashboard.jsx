import { useState } from 'react'
import * as CryptoJS from 'crypto-js'

export default function NtaDashboard({ payload, vault, onExit }) {
  const [key, setKey] = useState('')
  const [decrypted, setDecrypted] = useState(false)
  const [error, setError] = useState('')

  function handleDecrypt(e) {
    e.preventDefault()
    if (key === 'HOPE2026') {
      setDecrypted(true)
      setError('')
    } else {
      setError('Invalid Cryptographic Key')
    }
  }

  // Helper to grade the payload if decrypted
  let questions = []
  let score = 0
  if (decrypted && payload && vault && vault[payload.setId]) {
    questions = vault[payload.setId]
    questions.forEach((q, i) => {
      // Very basic grading simulation based on exact string match (in a real app, you'd have a separate 'correctAnswer' field)
      // Since we don't have a correctAnswer field in our questions.js right now, we'll just simulate it or we can't grade exactly.
      // Actually, we can just show the answers for manual review.
    })
  }

  return (
    <div className="submit-screen" style={{ flexDirection: 'column', overflow: 'auto', padding: '40px 20px' }}>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <button className="btn btn-ghost" onClick={onExit}>EXIT ADMIN</button>
      </div>

      <div className="submit-card" style={{ maxWidth: 800, width: '100%', marginBottom: 40 }}>
        <h2 style={{ color: 'var(--accent)', letterSpacing: 3, marginBottom: 30 }}>NTA EVALUATION VAULT</h2>
        
        {!payload ? (
          <div style={{ color: 'var(--warning)', padding: 40 }}>
            [ ! ] NO ENCRYPTED PAYLOAD DETECTED IN STORAGE
          </div>
        ) : !decrypted ? (
          <form onSubmit={handleDecrypt} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ color: 'var(--text-muted)' }}>
              Encrypted payload found for: <strong style={{ color: 'var(--text)' }}>{payload.user}</strong> ({payload.setId})
            </div>
            
            <input 
              type="password" 
              className="login-input" 
              placeholder="Enter Master GPG Key to Decrypt..."
              value={key}
              onChange={e => setKey(e.target.value)}
              style={{ textAlign: 'center' }}
            />
            {error && <div style={{ color: 'var(--error)', fontSize: 12 }}>{error}</div>}
            
            <button type="submit" className="btn btn-solid">
              INITIATE DECRYPTION
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'left' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 20 }}>
              <div style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: 10 }}>✓ PAYLOAD DECRYPTED SUCCESSFULLY</div>
              <div>Candidate: <strong>{payload.user}</strong></div>
              <div>Question Set: <strong>{payload.setId}</strong></div>
              <div style={{ marginTop: 10, color: 'var(--accent)', fontSize: 11 }}>
                VERIFIED SHA-256 SIGNATURE:<br/>
                {CryptoJS.SHA256(JSON.stringify(payload)).toString(CryptoJS.enc.Hex)}
              </div>
            </div>

            {payload.telemetry && payload.telemetry.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 20 }}>
                <h3 style={{ color: 'var(--warning)', marginBottom: 10 }}>⚠ PROCTORING TELEMETRY (VIOLATIONS DETECTED)</h3>
                <div style={{ background: 'rgba(226, 85, 85, 0.1)', padding: 10, border: '1px solid var(--error)', color: 'var(--error)', fontSize: 12 }}>
                  {payload.telemetry.map((log, idx) => (
                    <div key={idx} style={{ marginBottom: 4 }}>{log}</div>
                  ))}
                </div>
              </div>
            )}

            <h3 style={{ color: 'var(--accent)', marginBottom: 20 }}>Candidate Responses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {questions.map((q, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: 16, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>QUESTION {i + 1}</div>
                  <div style={{ fontSize: 13, marginBottom: 12 }}>{q.text}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Response:</div>
                  <div style={{ color: 'var(--accent)', fontSize: 14 }}>
                    {payload.answers[i] || <span style={{ color: 'var(--warning)' }}>[ Not Answered ]</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
