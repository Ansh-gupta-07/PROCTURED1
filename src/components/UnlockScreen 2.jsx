import { useState } from 'react'
import { vaultPayloads } from '../data/vault'
import * as CryptoJS from 'crypto-js'

export default function UnlockScreen({ onUnlock }) {
  const [key1, setKey1] = useState('')
  const [key2, setKey2] = useState('')
  const [error, setError] = useState('')
  const [isDecrypting, setIsDecrypting] = useState(false)

  function handleUnlock(e) {
    e.preventDefault()
    setIsDecrypting(true)
    setError('')

    // Simulate a slight delay to make it feel like a heavy cryptographic operation
    setTimeout(() => {
      try {
        if (key1 !== 'NTA_AUTH_CHACHA_2026' || key2 !== 'HOPE_OS_MASTER_KEY_2026') {
          throw new Error('Key mismatch')
        }

        const decryptVault = (ciphertext) => {
          // In simulation, we decrypt with the inner key (key2)
          const bytes = CryptoJS.AES.decrypt(ciphertext, key2)
          const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
          if (!decryptedString) throw new Error('Decryption Failed')
          return JSON.parse(decryptedString)
        }

        const decryptedSets = {
          "SET-A": decryptVault(vaultPayloads["SET-A"]),
          "SET-B": decryptVault(vaultPayloads["SET-B"]),
          "SET-C": decryptVault(vaultPayloads["SET-C"])
        }
        
        onUnlock(decryptedSets)
      } catch (err) {
        setError('Invalid Master Key or Corrupted Payload. Access Denied.')
        setIsDecrypting(false)
      }
    }, 1500)
  }

  return (
    <div className="login-screen">
      <div className="login-card" style={{ maxWidth: 500, width: '100%', border: '1px solid var(--accent)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div className="login-logo" style={{ animation: 'none' }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 10 }}>[ 🔒 ]</span>
            VAULT LOCKED
          </div>
          <div className="login-subtitle" style={{ color: 'var(--warning)' }}>
            NTA Center Master Key Required
          </div>
        </div>

        <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label style={{ color: 'var(--accent)' }}>AUTHORITY KEY (CHACHA20)</label>
            <input
              type="password"
              className="login-input"
              style={{ textAlign: 'center', letterSpacing: 4 }}
              placeholder="••••••••••••"
              value={key1}
              onChange={e => setKey1(e.target.value)}
              disabled={isDecrypting}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label style={{ color: 'var(--accent)' }}>FRAMING KEY (AES-256)</label>
            <input
              type="password"
              className="login-input"
              style={{ textAlign: 'center', letterSpacing: 4 }}
              placeholder="••••••••••••"
              value={key2}
              onChange={e => setKey2(e.target.value)}
              disabled={isDecrypting}
            />
          </div>

          {error && <div className="login-error" style={{ textAlign: 'center' }}>{error}</div>}

          <button 
            type="submit" 
            className="btn btn-solid"
            disabled={isDecrypting || !key1 || !key2}
            style={{ padding: '16px', letterSpacing: 2 }}
          >
            {isDecrypting ? 'DECRYPTING PAYLOADS...' : 'UNLOCK EXAM SETS'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 30, fontSize: 11, color: 'var(--text-muted)' }}>
          <p>Algorithm: AES-256-GCM + ChaCha20-Poly1305</p>
          <p style={{ marginTop: 4 }}>Any unauthorized access attempt will be logged to NTA servers.</p>
        </div>
      </div>
    </div>
  )
}
