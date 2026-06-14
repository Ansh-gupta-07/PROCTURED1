import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const C = {
  bg:          "#0A0F1E",
  bgCard:      "rgba(255,255,255,0.028)",
  bgHover:     "rgba(0,200,200,0.07)",
  bgActive:    "rgba(0,200,200,0.12)",
  text:        "#E8EDF5",
  muted:       "#4B5563",
  dim:         "#2D3748",
  accent:      "#00C8C8",
  accentBorder:"rgba(0,200,200,0.28)",
  accentGlow:  "rgba(0,200,200,0.12)",
  border:      "rgba(255,255,255,0.055)",
  error:       "#F87171",
  errorBg:     "rgba(248,113,113,0.08)",
  success:     "#34D399",
};
const FONT = "'JetBrains Mono','Courier New',monospace";

/* ─── EXAM QUESTIONS ─────────────────────────────────────────── */
const QUESTIONS = [
  "What is the primary function of an operating system?",
  "Explain the difference between RAM and ROM.",
  "What is a firewall and why is it important?",
  "Define the term 'encryption' in cybersecurity.",
  "What is a VPN and how does it protect user privacy?",
];

/* ─── ONE-TIME STYLE / SCRIPT INJECTION ─────────────────────── */
function useAssets() {
  useEffect(() => {
    if (!document.getElementById("hope-font")) {
      const l = document.createElement("link");
      l.id = "hope-font";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
    if (!document.getElementById("hope-css")) {
      const s = document.createElement("style");
      s.id = "hope-css";
      s.textContent = `
        .hope-input::placeholder { color: #2D3748; letter-spacing:2px; }
        .hope-input:focus { border-bottom-color: #00C8C8 !important; }
        .hope-ta::placeholder { color: #2D3748; }
        .hope-ta:focus { border-color: rgba(0,200,200,0.5) !important; outline: none; }
        .q-btn:hover { background: rgba(0,200,200,0.07) !important; border-color: rgba(0,200,200,0.4) !important; }
        .act-btn:hover { background: rgba(0,200,200,0.18) !important; }
        .ghost-btn:hover { background: rgba(255,255,255,0.06) !important; }
        @keyframes toastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanMove { 0%{transform:translateY(-4px)} 100%{transform:translateY(100vh)} }
        .toast-anim { animation: toastIn 0.25s ease; }
      `;
      document.head.appendChild(s);
    }
    if (!document.getElementById("hope-h2c")) {
      const sc = document.createElement("script");
      sc.id = "hope-h2c";
      sc.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      document.head.appendChild(sc);
    }
  }, []);
}

/* ─── HELPERS ────────────────────────────────────────────────── */
function px(n) { return `${n}px`; }

/* ─── STATUS BAR ─────────────────────────────────────────────── */
function StatusBar({ user, clock, onExport, onLog }) {
  return (
    <div style={{
      position:"fixed", top:0, left:0, right:0, height:px(46),
      background:"rgba(4,6,14,0.97)",
      borderBottom:`1px solid ${C.accentBorder}`,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 22px", zIndex:200, gap:16,
    }}>
      {/* Logo */}
      <div style={{ color:C.accent, fontFamily:FONT, fontWeight:700, fontSize:px(13), letterSpacing:5 }}>
        ◈ HOPE OS
      </div>
      {/* Right controls */}
      <div style={{ display:"flex", alignItems:"center", gap:20, fontFamily:FONT, fontSize:px(11) }}>
        <span style={{ color:C.muted }}>
          ● <span style={{ color:"#22C55E" }}>SYSTEM SECURE</span>
        </span>
        <span style={{ color:C.muted }}>
          SESSION: <span style={{ color:C.text }}>{user}</span>
        </span>
        <button className="act-btn" onClick={onExport} style={{
          background:"transparent", border:`1px solid ${C.accentBorder}`,
          color:C.accent, fontFamily:FONT, fontSize:px(10), letterSpacing:1,
          padding:"4px 13px", cursor:"pointer", transition:"background 0.15s",
        }}>
          EXPORT CSV
        </button>
        <button className="ghost-btn" onClick={onLog} style={{
          background:"transparent", border:`1px solid ${C.border}`,
          color:C.muted, fontFamily:FONT, fontSize:px(10),
          padding:"4px 11px", cursor:"pointer", transition:"background 0.15s",
        }}>
          [LOG]
        </button>
        <span style={{ color:C.accent, fontWeight:600, fontSize:px(12), letterSpacing:1 }}>
          {clock.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

/* ─── SCREEN 1: LOGIN ────────────────────────────────────────── */
function LoginScreen({ username, password, error, setU, setP, onLogin }) {
  return (
    <div style={{
      flex:1, display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative", overflow:"hidden",
    }}>
      {/* CRT scanline overlay */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.045) 2px,rgba(0,0,0,0.045) 4px)",
        zIndex:0,
      }} />

      {/* Card */}
      <div style={{
        position:"relative", zIndex:1,
        background:C.bgCard,
        border:`1px solid ${C.accentBorder}`,
        padding:"56px 68px",
        width:px(380),
        boxShadow:`0 0 80px rgba(0,200,200,0.045)`,
      }}>
        {/* Heading */}
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <h1 style={{
            fontFamily:FONT, fontWeight:700, fontSize:px(42),
            color:C.accent, letterSpacing:10, margin:"0 0 14px 0",
          }}>
            HOPE OS
          </h1>
          <p style={{
            fontFamily:FONT, fontSize:px(10), color:C.dim,
            letterSpacing:5, margin:0,
          }}>
            [ SECURE KIOSK ENVIRONMENT ]
          </p>
        </div>

        {/* Inputs */}
        <div style={{ marginBottom:28 }}>
          <input className="hope-input" type="text" placeholder="USERNAME"
            value={username} onChange={e => setU(e.target.value)}
            onKeyDown={e => e.key==="Enter" && onLogin()}
            style={{
              width:"100%", background:"transparent",
              border:"none", borderBottom:`1px solid rgba(0,200,200,0.32)`,
              color:C.text, fontFamily:FONT, fontSize:px(13),
              padding:"10px 0", outline:"none", letterSpacing:3,
              boxSizing:"border-box", transition:"border-color 0.2s",
            }} />
        </div>
        <div style={{ marginBottom:40 }}>
          <input className="hope-input" type="password" placeholder="PASSWORD"
            value={password} onChange={e => setP(e.target.value)}
            onKeyDown={e => e.key==="Enter" && onLogin()}
            style={{
              width:"100%", background:"transparent",
              border:"none", borderBottom:`1px solid rgba(0,200,200,0.32)`,
              color:C.text, fontFamily:FONT, fontSize:px(13),
              padding:"10px 0", outline:"none", letterSpacing:3,
              boxSizing:"border-box", transition:"border-color 0.2s",
            }} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            color:C.error, fontFamily:FONT, fontSize:px(11), letterSpacing:1,
            marginBottom:18, padding:"8px 12px",
            background:C.errorBg, border:`1px solid rgba(248,113,113,0.22)`,
          }}>
            ✗ {error}
          </div>
        )}

        {/* Authenticate */}
        <button className="act-btn" onClick={onLogin} style={{
          width:"100%", background:C.accentGlow,
          border:`1px solid ${C.accent}`, color:C.accent,
          fontFamily:FONT, fontSize:px(12), fontWeight:700, letterSpacing:4,
          padding:px(16), cursor:"pointer", transition:"background 0.18s",
        }}>
          ▶ AUTHENTICATE
        </button>
      </div>
    </div>
  );
}

/* ─── SCREEN 2: INSTRUCTIONS ─────────────────────────────────── */
function InstructionsScreen({ countdown, onBegin }) {
  const rules = [
    "Read each question carefully before answering",
    "All answers are auto-saved as you type",
    "Do not navigate away or close this window",
    "Your screen will be captured every 60 seconds for proctoring",
    "Once you begin, the timer starts immediately",
    "Click BEGIN EXAMINATION only when you are ready",
  ];
  return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{
        width:px(640), background:C.bgCard,
        border:`1px solid ${C.accentBorder}`, padding:"50px 56px",
      }}>
        {/* Title */}
        <h2 style={{
          fontFamily:FONT, fontWeight:700, fontSize:px(14), color:C.accent,
          letterSpacing:6, margin:"0 0 36px 0",
          paddingBottom:20, borderBottom:`1px solid rgba(0,200,200,0.14)`,
        }}>
          EXAMINATION BRIEFING
        </h2>

        {/* Rules block */}
        <div style={{
          background:"rgba(0,0,0,0.22)",
          border:`1px solid rgba(0,200,200,0.07)`,
          padding:"22px 26px", marginBottom:30,
          fontFamily:FONT, fontSize:px(12), lineHeight:"2.3", color:C.text,
        }}>
          {rules.map((r, i) => (
            <div key={i}>
              <span style={{ color:C.accent }}>▸</span>{" "}{r}
            </div>
          ))}
        </div>

        {/* Monitor notice */}
        <div style={{
          display:"flex", alignItems:"center", gap:10,
          color:"#F87171", fontFamily:FONT, fontSize:px(11),
          letterSpacing:1, marginBottom:20,
        }}>
          <span style={{ fontSize:px(14) }}>🔒</span> Screen monitoring is active
        </div>

        {/* Countdown */}
        <div style={{
          color:C.muted, fontFamily:FONT, fontSize:px(12),
          letterSpacing:1, marginBottom:32,
        }}>
          Session will auto-begin in{" "}
          <span style={{ color:C.accent, fontWeight:700, fontSize:px(15) }}>
            {countdown}s
          </span>
        </div>

        <button className="act-btn" onClick={onBegin} style={{
          background:C.accentGlow, border:`1px solid ${C.accent}`,
          color:C.accent, fontFamily:FONT, fontSize:px(12), fontWeight:700,
          letterSpacing:4, padding:"15px 44px", cursor:"pointer",
          transition:"background 0.18s",
        }}>
          ▶ BEGIN EXAMINATION
        </button>
      </div>
    </div>
  );
}

/* ─── SCREEN 3: EXAM ─────────────────────────────────────────── */
function ExamScreen({ currentQ, onSelect, answers, onAnswer, onSave, lastSaved }) {
  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

      {/* ── Left: Question Navigator ── */}
      <div style={{
        width:"38%", flexShrink:0,
        background:"rgba(0,0,0,0.18)",
        borderRight:`1px solid ${C.border}`,
        overflow:"auto", padding:"18px 12px",
      }}>
        <div style={{
          color:C.dim, fontFamily:FONT, fontSize:px(9), letterSpacing:5,
          marginBottom:14, paddingBottom:12,
          borderBottom:`1px solid rgba(255,255,255,0.05)`,
        }}>
          QUESTION NAVIGATOR
        </div>

        {QUESTIONS.map((q, i) => {
          const active = currentQ === i;
          const done   = !!answers[i];
          return (
            <div key={i} className="q-btn" onClick={() => onSelect(i)} style={{
              padding:"13px 13px", marginBottom:6, cursor:"pointer",
              border:`1px solid ${active ? "rgba(0,200,200,0.52)" : "rgba(255,255,255,0.04)"}`,
              background: active ? "rgba(0,200,200,0.08)" : "rgba(255,255,255,0.012)",
              display:"flex", gap:11, alignItems:"flex-start",
              transition:"all 0.14s ease",
            }}>
              {/* Status dot */}
              <div style={{
                width:6, height:6, borderRadius:"50%", flexShrink:0, marginTop:5,
                background: done ? C.accent : C.dim,
                boxShadow: done ? "0 0 6px rgba(0,200,200,0.55)" : "none",
              }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{
                  color: active ? C.accent : C.muted, fontFamily:FONT,
                  fontSize:px(10), fontWeight:600, letterSpacing:2, marginBottom:5,
                }}>
                  Q{i + 1}
                </div>
                <div style={{
                  color: active ? C.text : C.muted, fontFamily:FONT,
                  fontSize:px(11), lineHeight:"1.5",
                  overflow:"hidden",
                  display:"-webkit-box",
                  WebkitLineClamp:2,
                  WebkitBoxOrient:"vertical",
                }}>
                  {q}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Right: Answer Pane ── */}
      <div style={{
        flex:1, display:"flex", flexDirection:"column",
        padding:"28px 38px", overflow:"auto",
      }}>
        {/* Question display */}
        <div style={{
          background:`rgba(0,200,200,0.038)`,
          border:`1px solid rgba(0,200,200,0.11)`,
          padding:"18px 22px", marginBottom:22, flexShrink:0,
        }}>
          <div style={{
            color:C.dim, fontFamily:FONT, fontSize:px(9), letterSpacing:5, marginBottom:10,
          }}>
            QUESTION {currentQ + 1} / {QUESTIONS.length}
          </div>
          <p style={{
            color:C.text, fontFamily:FONT, fontSize:px(14), lineHeight:"1.9", margin:0,
          }}>
            {QUESTIONS[currentQ]}
          </p>
        </div>

        {/* Answer label */}
        <div style={{
          color:C.dim, fontFamily:FONT, fontSize:px(9),
          letterSpacing:5, marginBottom:10,
        }}>
          ▶ YOUR RESPONSE:
        </div>

        {/* Answer textarea */}
        <textarea className="hope-ta"
          value={answers[currentQ] || ""}
          onChange={e => onAnswer(currentQ, e.target.value)}
          placeholder="Begin typing your answer here…"
          style={{
            flex:1, minHeight:px(180),
            background:"rgba(255,255,255,0.012)",
            border:`1px solid rgba(0,200,200,0.2)`,
            color:C.text, fontFamily:FONT, fontSize:px(13), lineHeight:"1.95",
            padding:"16px 20px", resize:"none", marginBottom:16,
            boxSizing:"border-box", transition:"border-color 0.2s",
          }}
        />

        {/* Save bar */}
        <div style={{
          display:"flex", alignItems:"center", gap:16, flexShrink:0,
          paddingTop:14, borderTop:`1px solid rgba(255,255,255,0.05)`,
        }}>
          <button className="act-btn" onClick={onSave} style={{
            background:C.accentGlow, border:`1px solid rgba(0,200,200,0.48)`,
            color:C.accent, fontFamily:FONT, fontSize:px(11), fontWeight:600,
            letterSpacing:2, padding:"10px 26px", cursor:"pointer",
            transition:"background 0.18s",
          }}>
            SAVE RESPONSE
          </button>
          {lastSaved && (
            <span style={{ color:C.muted, fontFamily:FONT, fontSize:px(10), letterSpacing:1 }}>
              ✓ Last saved: {lastSaved}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── PROCTOR LOG OVERLAY ─────────────────────────────────────── */
function ProctorLog({ shots, onClose }) {
  return (
    <div style={{
      position:"fixed", inset:0,
      background:"rgba(4,6,14,0.96)", zIndex:300,
      display:"flex", flexDirection:"column", padding:"24px 28px", gap:20,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h3 style={{
          margin:0, color:C.accent, fontFamily:FONT,
          fontSize:px(12), fontWeight:700, letterSpacing:5,
        }}>
          PROCTOR CAPTURE LOG — {shots.length} CAPTURE{shots.length !== 1 ? "S" : ""}
        </h3>
        <button className="ghost-btn" onClick={onClose} style={{
          background:"transparent", border:`1px solid ${C.border}`,
          color:C.text, fontFamily:FONT, fontSize:px(11),
          padding:"6px 18px", cursor:"pointer", transition:"background 0.15s",
        }}>
          ✕ CLOSE
        </button>
      </div>

      <div style={{
        flex:1, overflow:"auto",
        display:"flex", flexWrap:"wrap", gap:12, alignContent:"flex-start",
      }}>
        {shots.length === 0 ? (
          <p style={{ color:C.muted, fontFamily:FONT, fontSize:px(12) }}>
            No captures yet. Screenshots are recorded automatically every 60 seconds during the examination.
          </p>
        ) : (
          shots.map((s, i) => (
            <div key={i} style={{
              border:`1px solid ${C.accentBorder}`,
              padding:5, background:C.bgCard,
            }}>
              <img src={s.dataUrl} alt={`Capture ${i+1}`}
                style={{ width:px(190), height:px(115), objectFit:"cover", display:"block" }} />
              <div style={{
                color:C.muted, fontFamily:FONT, fontSize:px(9),
                textAlign:"center", marginTop:4,
              }}>
                {s.time}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="toast-anim" style={{
      position:"fixed", bottom:22, right:22,
      background:"rgba(0,200,200,0.1)",
      border:`1px solid ${C.accent}`,
      color:C.accent, fontFamily:FONT, fontSize:px(11), letterSpacing:1,
      padding:"8px 18px", zIndex:400,
    }}>
      {msg}
    </div>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────── */
export default function HopeOS() {
  useAssets();

  /* Nav state */
  const [screen,  setScreen]  = useState("login");
  const [opacity, setOpacity] = useState(1);

  /* Auth */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [sessionUser, setSessionUser] = useState("");

  /* Instructions */
  const [countdown, setCountdown] = useState(60);

  /* Exam */
  const [currentQ,  setCurrentQ]  = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [lastSaved, setLastSaved] = useState(null);

  /* Proctor */
  const [shots,   setShots]   = useState([]);
  const [toast,   setToast]   = useState(null);
  const [showLog, setShowLog] = useState(false);

  /* Clock */
  const [clock, setClock] = useState(new Date());

  const appRef = useRef(null);

  /* Clock tick */
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Instructions auto-begin countdown */
  useEffect(() => {
    if (screen !== "instructions") return;
    if (countdown <= 0) { navigate("exam"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  });

  /* Proctoring: capture every 60s during exam */
  useEffect(() => {
    if (screen !== "exam") return;
    const interval = setInterval(captureScreen, 60_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  /* ── Helpers ── */
  function navigate(to) {
    setOpacity(0);
    setTimeout(() => { setScreen(to); setOpacity(1); }, 300);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  async function captureScreen() {
    if (!window.html2canvas || !appRef.current) return;
    try {
      const canvas = await window.html2canvas(appRef.current, { scale:0.38, useCORS:true, logging:false });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.52);
      const time = new Date().toLocaleTimeString();
      setShots(prev => [...prev, { dataUrl, time }]);
      showToast(`📸 Screen captured ${time}`);
    } catch { /* silent */ }
  }

  function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setLoginError("ACCESS DENIED: credentials required");
      return;
    }
    setSessionUser(username.trim());
    setLoginError("");
    navigate("instructions");
  }

  function handleSave() {
    const t = new Date().toLocaleTimeString();
    setLastSaved(t);
    showToast("✓ Response saved");
  }

  function exportCSV() {
    const header = "Question,Answer,Timestamp,Username";
    const rows = QUESTIONS.map((q, i) =>
      `"${q}","${(answers[i] || "").replace(/"/g,'""')}","${new Date().toISOString()}","${sessionUser}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `exam-${sessionUser}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ── Render ── */
  return (
    <div ref={appRef} style={{
      background:C.bg, color:C.text, fontFamily:FONT,
      width:"100vw", height:"100vh", overflow:"hidden",
      opacity, transition:"opacity 0.3s ease",
      position:"relative",
    }}>

      {/* Status bar (post-login) */}
      {screen !== "login" && (
        <StatusBar
          user={sessionUser}
          clock={clock}
          onExport={exportCSV}
          onLog={() => setShowLog(v => !v)}
        />
      )}

      {/* Content area */}
      <div style={{
        display:"flex",
        height:"100vh",
        paddingTop: screen !== "login" ? px(46) : 0,
        boxSizing:"border-box",
        overflow: screen === "exam" ? "hidden" : "auto",
      }}>
        {screen === "login" && (
          <LoginScreen
            username={username} password={password} error={loginError}
            setU={setUsername} setP={setPassword} onLogin={handleLogin}
          />
        )}
        {screen === "instructions" && (
          <InstructionsScreen countdown={countdown} onBegin={() => navigate("exam")} />
        )}
        {screen === "exam" && (
          <ExamScreen
            currentQ={currentQ} onSelect={setCurrentQ}
            answers={answers}
            onAnswer={(i, v) => setAnswers(a => ({ ...a, [i]:v }))}
            onSave={handleSave} lastSaved={lastSaved}
          />
        )}
      </div>

      {/* Proctor log overlay */}
      {showLog && <ProctorLog shots={shots} onClose={() => setShowLog(false)} />}

      {/* Toast notification */}
      <Toast msg={toast} />
    </div>
  );
}
