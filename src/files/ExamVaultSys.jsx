import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────── */
const C = {
  bg:        "#080B12",
  bgSide:    "#0D1117",
  bgCard:    "rgba(255,255,255,0.038)",
  bgInput:   "rgba(255,255,255,0.06)",
  text:      "#E6EDF3",
  muted:     "#6E7681",
  dim:       "#21262D",
  accent:    "#00C8C8",
  accentBg:  "rgba(0,200,200,0.1)",
  accentBdr: "rgba(0,200,200,0.3)",
  green:     "#22C55E",
  greenBg:   "rgba(34,197,94,0.1)",
  amber:     "#F59E0B",
  amberBg:   "rgba(245,158,11,0.1)",
  red:       "#F87171",
  border:    "rgba(255,255,255,0.07)",
};
const MONO = "'JetBrains Mono','Courier New',monospace";
const SANS = "'Inter','Segoe UI',system-ui,sans-serif";

/* ─── SEED DATA ─────────────────────────────────────────── */
const SEED_VAULT = [
  { id:"CS301", name:"Computer Networks",   hash:"8f2d...3a91", status:"LOCKED",  added:"2024-10-01" },
  { id:"CS302", name:"Cyber Security",      hash:"4a1b...e92f", status:"DEPLOY",  added:"2024-10-02" },
  { id:"CS303", name:"Database Systems",    hash:"c9e1...7f23", status:"LOCKED",  added:"2024-10-03" },
  { id:"CS304", name:"Advanced Algorithms", hash:"e3b0...3922", status:"PENDING", added:"2024-10-04" },
  { id:"CS305", name:"Operating Systems",   hash:"—",           status:"PENDING", added:"—"         },
];
const SEED_LOG = [
  { t:"22:34:12", msg:"CS304 encrypted via AES-256-GCM + ChaCha20-Poly1305", lvl:"success" },
  { t:"22:31:05", msg:"Dr. Amelia Chen authenticated from 192.168.1.42",     lvl:"info"    },
  { t:"22:28:44", msg:"Vault CS302 status changed: LOCKED → DEPLOY",         lvl:"warn"    },
  { t:"22:15:30", msg:"CS303 integrity hash verified: PASS",                  lvl:"success" },
  { t:"22:10:18", msg:"CS301 accessed by Paper Framing In-Charge",            lvl:"info"    },
  { t:"22:05:01", msg:"System boot — all vault seals intact",                 lvl:"success" },
];

/* ─── STYLE INJECTION ───────────────────────────────────── */
function useStyles() {
  useEffect(() => {
    if (document.getElementById("evs-css")) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
    const s = document.createElement("style");
    s.id = "evs-css";
    s.textContent = `
      *{box-sizing:border-box;}
      body{margin:0;overflow:hidden;background:#080B12;}
      .nav:hover{background:rgba(255,255,255,0.05)!important;}
      .row:hover{background:rgba(255,255,255,0.035)!important;}
      .inp{transition:border-color .2s;}
      .inp:focus{outline:none;border-color:rgba(0,200,200,.55)!important;}
      .inp::placeholder{color:#2D333B;}
      .sel{appearance:none;}
      .dz.over{border-color:#00C8C8!important;background:rgba(0,200,200,.05)!important;}
      .tbtn:hover{background:rgba(0,200,200,.2)!important;}
      .gbtn:hover{background:rgba(255,255,255,.07)!important;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes fillBar{from{width:0}to{width:100%}}
      .fade{animation:fadeUp .28s ease;}
      .pulse{animation:pulse 2.2s infinite;}
      .spin{animation:spin .9s linear infinite;}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-thumb{background:rgba(0,200,200,.22);border-radius:2px;}
    `;
    document.head.appendChild(s);
  }, []);
}

/* ─── HELPERS ───────────────────────────────────────────── */
const fmt = s => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

async function sha256hex(buf) {
  const h = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

/* ─── ATOMS ─────────────────────────────────────────────── */
function Badge({ status }) {
  const map = {
    LOCKED:  ["rgba(0,200,200,.12)",    "#00C8C8"],
    DEPLOY:  ["rgba(34,197,94,.12)",    "#22C55E"],
    PENDING: ["rgba(245,158,11,.12)",   "#F59E0B"],
  };
  const [bg, col] = map[status] || map.PENDING;
  return (
    <span style={{ background:bg, color:col, fontFamily:MONO, fontSize:9,
      fontWeight:700, letterSpacing:1, padding:"3px 9px", borderRadius:3 }}>
      {status}
    </span>
  );
}

function LogLine({ e, compact }) {
  const col = { success:C.green, info:C.accent, warn:C.amber, error:C.red }[e.lvl] || C.muted;
  return (
    <div style={{ display:"flex", gap:10, padding: compact?"5px 0":"10px 0",
      borderBottom:"1px solid rgba(255,255,255,.04)", alignItems:"flex-start" }}>
      <span style={{ color:C.muted, fontFamily:MONO, fontSize:10, flexShrink:0, marginTop:1 }}>{e.t}</span>
      <div style={{ width:4, height:4, borderRadius:"50%", background:col, marginTop:4, flexShrink:0 }}/>
      <span style={{ color:C.text, fontFamily:SANS, fontSize:11, lineHeight:1.55 }}>{e.msg}</span>
    </div>
  );
}

function Lbl({ children }) {
  return <div style={{ color:C.muted, fontFamily:SANS, fontSize:10, fontWeight:600,
    letterSpacing:1, marginBottom:6 }}>{children}</div>;
}

function Inp({ value, onChange, placeholder, type="text", style={} }) {
  return <input className="inp" type={type} value={value} placeholder={placeholder}
    onChange={e=>onChange(e.target.value)} style={{
      width:"100%", background:C.bgInput, border:`1px solid ${C.border}`,
      color:C.text, fontFamily:SANS, fontSize:13, padding:"9px 12px",
      borderRadius:6, ...style }} />;
}

function Field({ label, ...props }) {
  return <div><Lbl>{label.toUpperCase()}</Lbl><Inp {...props}/></div>;
}

function PrimaryBtn({ children, onClick, disabled, style={} }) {
  return <button className="tbtn" onClick={onClick} disabled={disabled} style={{
    background: disabled ? C.dim : C.accentBg,
    border:`1px solid ${disabled ? "transparent" : C.accent}`,
    color: disabled ? C.muted : C.accent,
    fontFamily:SANS, fontSize:12, fontWeight:600, padding:"9px 22px",
    cursor: disabled ? "not-allowed" : "pointer", borderRadius:6,
    transition:"background .15s", ...style }}>
    {children}
  </button>;
}

function GhostBtn({ children, onClick }) {
  return <button className="gbtn" onClick={onClick} style={{
    background:"transparent", border:`1px solid ${C.border}`,
    color:C.muted, fontFamily:SANS, fontSize:12, padding:"9px 18px",
    cursor:"pointer", borderRadius:6, transition:"background .15s" }}>
    {children}
  </button>;
}

/* ─── STATUS BAR ─────────────────────────────────────────── */
function StatusBar({ cd }) {
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, height:52,
      background:"rgba(5,7,13,.97)", borderBottom:`1px solid ${C.border}`,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 24px", zIndex:300 }}>
      <span style={{ fontFamily:MONO, fontWeight:700, fontSize:13, color:C.text, letterSpacing:1.5 }}>
        EXAM VAULT SYS
      </span>
      <div style={{ display:"flex", alignItems:"center", gap:7, background:C.greenBg,
        border:"1px solid rgba(34,197,94,.25)", padding:"5px 14px", borderRadius:20 }}>
        <div className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:C.green }}/>
        <span style={{ color:C.green, fontFamily:MONO, fontSize:10, fontWeight:600, letterSpacing:1 }}>
          SYSTEM SECURE
        </span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:22, fontFamily:SANS, fontSize:13 }}>
        <span style={{ color:C.muted }}>
          Auto-Lock:{" "}
          <span style={{ color: cd<60 ? C.red : C.text, fontFamily:MONO }}>{fmt(cd)}</span>
        </span>
        <div style={{ display:"flex", alignItems:"center", gap:9, color:C.text, fontWeight:500 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0,
            background:"linear-gradient(135deg,#6366F1,#00C8C8)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, fontWeight:700, color:"#fff" }}>A</div>
          Dr. Amelia Chen <span style={{ color:C.muted }}>▾</span>
        </div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR ─────────────────────────────────────────────── */
const NAV = [
  { id:"dash",    icon:"⊞", label:"DASHBOARD"           },
  { id:"vault",   icon:"🗄", label:"VAULT INVENTORY"     },
  { id:"submit",  icon:"✎", label:"SUBMIT QUESTION PAPER"},
  { id:"access",  icon:"🔐", label:"ACCESS CONTROL"      },
  { id:"audit",   icon:"📋", label:"AUDIT TRAILS"        },
  { id:"cfg",     icon:"⚙", label:"SYSTEM SETTINGS"     },
];

function Sidebar({ active, onNav }) {
  return (
    <div style={{ position:"fixed", top:52, left:0, bottom:0, width:220,
      background:C.bgSide, borderRight:`1px solid ${C.border}`,
      padding:"14px 0", zIndex:200, overflowY:"auto" }}>
      {NAV.map(n => {
        const on = active===n.id;
        return (
          <div key={n.id} className="nav" onClick={()=>onNav(n.id)} style={{
            display:"flex", alignItems:"center", gap:11,
            padding:"11px 18px", cursor:"pointer",
            background: on ? "rgba(0,200,200,.1)" : "transparent",
            borderLeft: on ? `3px solid ${C.accent}` : "3px solid transparent",
            color: on ? C.accent : C.muted,
            fontFamily:SANS, fontSize:11, fontWeight: on?600:400,
            letterSpacing:.4, transition:"all .12s" }}>
            <span style={{ fontSize:13, opacity:on?1:.55 }}>{n.icon}</span>
            {n.label}
          </div>
        );
      })}
    </div>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────── */
function DashPage({ vault, log, onNav }) {
  const stats = [
    ["TOTAL VAULTS",    vault.length,                             C.accent],
    ["SEALED",          vault.filter(v=>v.status==="LOCKED").length, C.green],
    ["READY TO DEPLOY", vault.filter(v=>v.status==="DEPLOY").length, C.amber],
    ["PENDING",         vault.filter(v=>v.status==="PENDING").length, C.muted],
  ];
  return (
    <div className="fade" style={{ padding:28, maxWidth:940 }}>
      <div style={{ color:C.muted, fontFamily:SANS, fontSize:11, marginBottom:4 }}>Overview</div>
      <h1 style={{ margin:"0 0 26px", color:C.text, fontFamily:SANS, fontSize:20, fontWeight:600 }}>
        System Dashboard
      </h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {stats.map(([l,v,col])=>(
          <div key={l} style={{ background:C.bgCard, border:`1px solid ${C.border}`,
            borderRadius:8, padding:"16px 18px" }}>
            <div style={{ color:C.muted, fontFamily:SANS, fontSize:10, fontWeight:600,
              letterSpacing:1, marginBottom:8 }}>{l}</div>
            <div style={{ color:col, fontFamily:MONO, fontSize:28, fontWeight:700 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {/* Vault list */}
        <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:8, padding:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ color:C.text, fontFamily:SANS, fontSize:13, fontWeight:600 }}>
              Active Vaults
            </span>
            <span onClick={()=>onNav("vault")} style={{ color:C.accent, fontFamily:SANS,
              fontSize:11, cursor:"pointer" }}>View all →</span>
          </div>
          {vault.slice(0,4).map(v=>(
            <div key={v.id} style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", padding:"8px 0",
              borderBottom:"1px solid rgba(255,255,255,.04)" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontFamily:MONO, fontSize:11, color:C.accent }}>{v.id}</span>
                <span style={{ fontFamily:SANS, fontSize:12, color:C.text }}>{v.name}</span>
              </div>
              <Badge status={v.status}/>
            </div>
          ))}
        </div>
        {/* Audit feed */}
        <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:8, padding:18 }}>
          <div style={{ color:C.text, fontFamily:SANS, fontSize:13, fontWeight:600, marginBottom:12 }}>
            Live Audit Feed
          </div>
          {log.slice(0,5).map((e,i)=><LogLine key={i} e={e} compact/>)}
        </div>
      </div>
    </div>
  );
}

/* ─── VAULT INVENTORY ────────────────────────────────────── */
function VaultPage({ vault, onNav }) {
  const [q,setQ]=useState("");
  const rows = vault.filter(v=>v.id.toLowerCase().includes(q.toLowerCase())||
    v.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fade" style={{ padding:28 }}>
      <div style={{ color:C.muted, fontFamily:SANS, fontSize:11, marginBottom:4 }}>
        Dashboard › Vault Inventory
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <h1 style={{ margin:0, color:C.text, fontFamily:SANS, fontSize:20, fontWeight:600 }}>
          Vault Inventory
        </h1>
        <button className="tbtn" onClick={()=>onNav("submit")} style={{
          background:C.accentBg, border:`1px solid ${C.accent}`,
          color:C.accent, fontFamily:SANS, fontSize:12, fontWeight:600,
          padding:"9px 18px", cursor:"pointer", borderRadius:6, transition:"background .15s" }}>
          + Upload Paper
        </button>
      </div>
      <input className="inp" value={q} onChange={e=>setQ(e.target.value)}
        placeholder="Search papers…" style={{
          background:C.bgInput, border:`1px solid ${C.border}`, color:C.text,
          fontFamily:SANS, fontSize:13, padding:"9px 14px", borderRadius:6,
          width:280, marginBottom:16 }}/>
      <div style={{ background:C.bgCard, border:`1px solid ${C.border}`,
        borderRadius:8, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"90px 1fr 210px 110px 90px",
          padding:"9px 16px", borderBottom:`1px solid ${C.border}`,
          color:C.muted, fontFamily:MONO, fontSize:9, letterSpacing:1 }}>
          {["CODE","PAPER NAME","INTEGRITY HASH","STATUS","ACTION"].map(h=>(
            <span key={h}>{h}</span>
          ))}
        </div>
        {rows.map((v,i)=>(
          <div key={v.id} className="row" style={{ display:"grid",
            gridTemplateColumns:"90px 1fr 210px 110px 90px",
            padding:"13px 16px",
            borderBottom: i<rows.length-1 ? `1px solid ${C.border}` : "none",
            alignItems:"center", transition:"background .11s" }}>
            <span style={{ fontFamily:MONO, fontSize:12, color:C.accent, fontWeight:600 }}>{v.id}</span>
            <span style={{ fontFamily:SANS, fontSize:12, color:C.text }}>{v.name}</span>
            <span style={{ fontFamily:MONO, fontSize:10, color:C.muted }}>{v.hash}</span>
            <Badge status={v.status}/>
            <span style={{ color:C.accent, fontFamily:SANS, fontSize:11, cursor:"pointer" }}>
              {v.status==="DEPLOY"?"Launch":"Logs"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SUBMIT WIZARD ──────────────────────────────────────── */
function SubmitPage({ onAdd, onAudit }) {
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({code:"",name:"",set:"Set A (Main)",date:"",time:"",notes:""});
  const [file,setFile]=useState(null);
  const [prog,setProg]=useState(0);
  const [loading,setLoading]=useState(false);
  const [hash,setHash]=useState("");
  const [over,setOver]=useState(false);
  const [k1,setK1]=useState("");
  const [k2,setK2]=useState("");
  const [sealing,setSealing]=useState(false);
  const [done,setDone]=useState(false);
  const [sealProg,setSealProg]=useState(0);
  const ref=useRef();

  async function processFile(f) {
    setFile(f); setLoading(true); setProg(0); setHash("");
    for(let i=0;i<=100;i+=4){ await new Promise(r=>setTimeout(r,38)); setProg(i); }
    try {
      const buf=await f.arrayBuffer();
      setHash(await sha256hex(buf));
    } catch {
      setHash("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    }
    setLoading(false);
  }

  async function handleSeal() {
    if(!k1||!k2) return;
    setSealing(true);
    for(let i=0;i<=100;i+=2){ await new Promise(r=>setTimeout(r,22)); setSealProg(i); }
    setSealing(false); setDone(true);
    const short=hash.slice(0,8)+"..."+hash.slice(-4);
    onAdd({ id:form.code, name:form.name, hash:short, status:"LOCKED", added:form.date||"—" });
    onAudit({ t:new Date().toLocaleTimeString(),
      msg:`${form.code} sealed — AES-256-GCM (Key1) + ChaCha20-Poly1305 (Key2) applied`, lvl:"success" });
  }

  function reset() {
    setStep(0);setForm({code:"",name:"",set:"Set A (Main)",date:"",time:"",notes:""});
    setFile(null);setProg(0);setHash("");setK1("");setK2("");setDone(false);setSealProg(0);
  }

  const STEPS=["1. Details","2. Upload & Hash","3. Verify & Seal"];

  return (
    <div className="fade" style={{ padding:28, maxWidth:800 }}>
      <div style={{ color:C.muted, fontFamily:SANS, fontSize:11, marginBottom:4 }}>
        Dashboard › Submit Question Paper
      </div>
      <h1 style={{ margin:"0 0 26px", color:C.text, fontFamily:SANS, fontSize:20, fontWeight:600 }}>
        Submit New Question Paper
      </h1>

      {/* Stepper */}
      <div style={{ display:"flex", background:C.bgCard, border:`1px solid ${C.border}`,
        borderRadius:8, overflow:"hidden", marginBottom:28 }}>
        {STEPS.map((s,i)=>{
          const done_=step>i, active=step===i;
          return (
            <div key={i} style={{ flex:1, display:"flex", alignItems:"center", gap:8,
              padding:"12px 16px",
              background: done_ ? "rgba(0,200,200,.06)" : active ? "rgba(0,200,200,.04)" : "transparent",
              borderRight: i<2?`1px solid ${C.border}`:"none",
              color: done_?C.accent : active?C.text : C.muted,
              fontFamily:SANS, fontSize:12, fontWeight:active?600:400 }}>
              <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
                background: done_?C.accent : active?"rgba(0,200,200,.2)": C.dim,
                color: done_?"#080B12" : active?C.accent:C.muted,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10, fontWeight:700 }}>
                {done_?"✓":i+1}
              </div>
              {s}
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div style={{ background:C.bgCard, border:`1px solid ${C.border}`,
        borderRadius:8, padding:"28px 30px" }}>

        {/* ── Step 0: Details ── */}
        {step===0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Field label="Exam Code & Course Name" value={form.code}
                onChange={v=>setForm(f=>({...f,code:v}))} placeholder="e.g. CS-304"/>
              <Field label=" " value={form.name}
                onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Advanced Algorithms"/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
              <div>
                <Lbl>PAPER SET</Lbl>
                <select className="inp sel" value={form.set}
                  onChange={e=>setForm(f=>({...f,set:e.target.value}))} style={{
                    width:"100%", background:C.bgInput,
                    border:`1px solid ${C.border}`, color:C.text,
                    fontFamily:SANS, fontSize:13, padding:"9px 12px", borderRadius:6 }}>
                  <option>Set A (Main)</option>
                  <option>Set B (Alternate)</option>
                  <option>Set C (Backup)</option>
                </select>
              </div>
              <Field label="Exam Date & Time" value={form.date} type="date"
                onChange={v=>setForm(f=>({...f,date:v}))}/>
              <Field label=" " value={form.time} type="time"
                onChange={v=>setForm(f=>({...f,time:v}))}/>
            </div>
            <div>
              <Lbl>NOTES / INSTRUCTIONS</Lbl>
              <textarea className="inp" value={form.notes}
                onChange={e=>setForm(f=>({...f,notes:e.target.value}))}
                placeholder="Include diagrams for Q3 and Q5. Verify final question counts."
                style={{ width:"100%", background:C.bgInput,
                  border:`1px solid ${C.border}`, color:C.text,
                  fontFamily:SANS, fontSize:13, padding:"9px 12px", borderRadius:6,
                  height:80, resize:"vertical" }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:4 }}>
              <PrimaryBtn onClick={()=>setStep(1)} disabled={!form.code||!form.name}>
                Continue →
              </PrimaryBtn>
            </div>
          </div>
        )}

        {/* ── Step 1: Upload & Hash ── */}
        {step===1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <Lbl>UPLOAD PAPER</Lbl>
            {/* Drop zone */}
            <div className={`dz${over?" over":""}`}
              onDragOver={e=>{e.preventDefault();setOver(true);}}
              onDragLeave={()=>setOver(false)}
              onDrop={e=>{e.preventDefault();setOver(false);
                const f=e.dataTransfer.files[0];if(f)processFile(f);}}
              onClick={()=>ref.current.click()} style={{
                border:`2px dashed ${over?C.accent:C.border}`, borderRadius:8,
                padding:"36px 20px", textAlign:"center", cursor:"pointer",
                transition:"all .2s", display:"flex", flexDirection:"column",
                alignItems:"center", gap:10 }}>
              <div style={{ fontSize:32 }}>📄</div>
              <button style={{ background:C.accent, color:"#080B12", fontFamily:SANS,
                fontSize:12, fontWeight:700, padding:"9px 22px", border:"none",
                borderRadius:6, cursor:"pointer", letterSpacing:.5 }}>
                UPLOAD FILES
              </button>
              <span style={{ color:C.muted, fontFamily:SANS, fontSize:12 }}>
                Drag & drop PDF, LaTeX, or encrypted source files here.
              </span>
              <input ref={ref} type="file" accept=".pdf,.tex,.zip" style={{ display:"none" }}
                onChange={e=>{ const f=e.target.files[0]; if(f) processFile(f); }}/>
            </div>

            {/* File + progress */}
            {file && (
              <div style={{ background:C.bgInput, border:`1px solid ${C.border}`,
                borderRadius:6, padding:"12px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:8 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ fontSize:16 }}>📄</span>
                    <span style={{ color:C.text, fontFamily:SANS, fontSize:12 }}>{file.name}</span>
                    <span style={{ color:C.muted, fontFamily:SANS, fontSize:11 }}>
                      ({(file.size/1024/1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <span style={{ color:prog<100?C.amber:C.green, fontFamily:MONO, fontSize:11 }}>
                    {prog<100?`${prog}%`:"100% Uploaded"}
                  </span>
                </div>
                <div style={{ height:3, background:C.dim, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${prog}%`,
                    background:prog<100?C.amber:C.green,
                    transition:"width .08s, background .3s" }}/>
                </div>
              </div>
            )}

            {/* Hash */}
            {hash && (
              <div>
                <Lbl>INTEGRITY HASH (SHA-256)</Lbl>
                <div style={{ background:C.bgInput, border:`1px solid rgba(0,200,200,.22)`,
                  borderRadius:6, padding:"10px 14px", fontFamily:MONO, fontSize:10,
                  color:"#5B8DB8", wordBreak:"break-all", lineHeight:1.7 }}>
                  {hash}
                </div>
                <div style={{ color:C.green, fontFamily:SANS, fontSize:11, marginTop:6 }}>
                  ✓ Integrity Verified. Tamper-Proof Signature Generated.
                </div>
              </div>
            )}

            <div style={{ display:"flex", justifyContent:"space-between", paddingTop:4 }}>
              <GhostBtn onClick={()=>setStep(0)}>← Back</GhostBtn>
              <PrimaryBtn onClick={()=>setStep(2)} disabled={!hash||loading}>
                Continue →
              </PrimaryBtn>
            </div>
          </div>
        )}

        {/* ── Step 2: Verify & Seal ── */}
        {step===2 && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* Encryption pipeline */}
            <div style={{ background:"rgba(0,0,0,.2)", border:`1px solid ${C.border}`,
              borderRadius:8, padding:"16px 22px" }}>
              <div style={{ color:C.muted, fontFamily:SANS, fontSize:10, fontWeight:600,
                letterSpacing:1, marginBottom:14 }}>CASCADE ENCRYPTION PIPELINE</div>
              <div style={{ display:"flex", alignItems:"center", gap:6,
                flexWrap:"wrap", fontFamily:MONO, fontSize:11 }}>
                {[
                  {box:"Original PDF",       col:C.text},
                  {arr:"AES-256-GCM\n(Key 1 → In-Charge)"},
                  {box:"Encrypted Block",    col:C.amber},
                  {arr:"ChaCha20-Poly1305\n(Key 2 → Authority)"},
                  {box:"Double Ciphertext",  col:C.accent},
                ].map((x,i)=>x.box?(
                  <div key={i} style={{ background:C.bgCard, border:`1px solid ${C.border}`,
                    borderRadius:5, padding:"7px 12px",
                    color:x.col, fontWeight:600, fontSize:11, flexShrink:0 }}>
                    {x.box}
                  </div>
                ):(
                  <div key={i} style={{ display:"flex", flexDirection:"column",
                    alignItems:"center", minWidth:88, textAlign:"center" }}>
                    <span style={{ color:C.accent, fontSize:9 }}>{x.arr.split("\n")[0]}</span>
                    <span style={{ color:C.muted, fontSize:8 }}>{x.arr.split("\n")[1]}</span>
                    <span style={{ color:C.accent, fontSize:16, marginTop:1 }}>→</span>
                  </div>
                ))}
              </div>
            </div>

            {!done ? (<>
              {/* Key inputs */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <Lbl>KEY 1 — PAPER FRAMING IN-CHARGE</Lbl>
                  <input className="inp" type="password" value={k1}
                    onChange={e=>setK1(e.target.value)}
                    placeholder="AES-256-GCM passphrase…" style={{
                      width:"100%", background:C.bgInput, border:`1px solid ${C.border}`,
                      color:C.text, fontFamily:MONO, fontSize:12, padding:"10px 14px",
                      borderRadius:6 }}/>
                  <div style={{ color:C.muted, fontFamily:SANS, fontSize:10, marginTop:5 }}>
                    Inner layer · AES-256-GCM
                  </div>
                </div>
                <div>
                  <Lbl>KEY 2 — EXAM CONDUCTING AUTHORITY</Lbl>
                  <input className="inp" type="password" value={k2}
                    onChange={e=>setK2(e.target.value)}
                    placeholder="ChaCha20-Poly1305 passphrase…" style={{
                      width:"100%", background:C.bgInput, border:`1px solid ${C.border}`,
                      color:C.text, fontFamily:MONO, fontSize:12, padding:"10px 14px",
                      borderRadius:6 }}/>
                  <div style={{ color:C.muted, fontFamily:SANS, fontSize:10, marginTop:5 }}>
                    Outer layer · ChaCha20-Poly1305
                  </div>
                </div>
              </div>

              {/* Seal progress */}
              {sealing && (
                <div style={{ background:C.accentBg, border:`1px solid ${C.accentBdr}`,
                  borderRadius:6, padding:"14px 18px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10,
                    color:C.accent, fontFamily:MONO, fontSize:12, marginBottom:10 }}>
                    <div className="spin" style={{ width:13, height:13, flexShrink:0,
                      border:`2px solid ${C.accent}`, borderTopColor:"transparent",
                      borderRadius:"50%" }}/>
                    Applying cascade encryption…
                  </div>
                  <div style={{ height:3, background:C.dim, borderRadius:2 }}>
                    <div style={{ height:"100%", width:`${sealProg}%`,
                      background:C.accent, transition:"width .06s" }}/>
                  </div>
                  <div style={{ color:C.muted, fontFamily:SANS, fontSize:10, marginTop:6 }}>
                    {sealProg < 50
                      ? `Layer 1: AES-256-GCM encryption in progress… ${sealProg*2}%`
                      : `Layer 2: ChaCha20-Poly1305 outer encryption… ${(sealProg-50)*2}%`}
                  </div>
                </div>
              )}

              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:4 }}>
                <GhostBtn onClick={()=>setStep(1)}>← Back</GhostBtn>
                <button onClick={handleSeal} disabled={!k1||!k2||sealing} style={{
                  background: k1&&k2&&!sealing ? C.accent : C.dim,
                  border:"none", color:"#080B12",
                  fontFamily:SANS, fontSize:13, fontWeight:700,
                  padding:"11px 28px", cursor: k1&&k2&&!sealing?"pointer":"not-allowed",
                  borderRadius:6, opacity:sealing?.75:1, transition:"all .15s" }}>
                  {sealing?"Sealing…":"SUBMIT & SEAL PAPER"}
                </button>
              </div>
            </>) : (
              /* Success */
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
                gap:16, padding:"28px 0" }}>
                <div style={{ width:60, height:60, borderRadius:"50%",
                  background:C.greenBg, border:`2px solid ${C.green}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:26 }}>✓</div>
                <h3 style={{ margin:0, color:C.green, fontFamily:SANS, fontSize:17, fontWeight:600 }}>
                  Paper Sealed Successfully
                </h3>
                <p style={{ margin:0, color:C.muted, fontFamily:SANS, fontSize:13,
                  textAlign:"center", maxWidth:400, lineHeight:1.6 }}>
                  <strong style={{ color:C.text }}>{form.code} — {form.name}</strong> has been
                  double-encrypted and stored in the vault.
                  Both keyholders are required to decrypt.
                </p>
                <div style={{ background:"rgba(0,0,0,.3)", border:`1px solid ${C.border}`,
                  borderRadius:8, padding:"14px 20px", fontFamily:MONO, fontSize:11,
                  color:C.muted, width:"100%", lineHeight:2 }}>
                  <div>🔒 AES-256-GCM (Inner) — Key 1 applied</div>
                  <div>🔒 ChaCha20-Poly1305 (Outer) — Key 2 applied</div>
                  <div style={{ color:C.accent, marginTop:4 }}>
                    SHA-256: {hash.slice(0,16)}…{hash.slice(-8)}
                  </div>
                </div>
                <button className="tbtn" onClick={reset} style={{
                  background:C.accentBg, border:`1px solid ${C.accent}`,
                  color:C.accent, fontFamily:SANS, fontSize:12, fontWeight:600,
                  padding:"10px 22px", cursor:"pointer", borderRadius:6,
                  transition:"background .15s" }}>
                  + Submit Another Paper
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ACCESS CONTROL ─────────────────────────────────────── */
function AccessPage() {
  const admins=[
    {name:"Dr. Amelia Chen",role:"Chief Exam Controller",
     device:"MacBook Pro #A2443",loc:"192.168.1.42",last:"22:31:05"},
    {name:"Prof. Rajesh Kumar",role:"Paper Framing In-Charge",
     device:"Dell XPS #B9821",loc:"192.168.1.55",last:"21:45:22"},
    {name:"Ms. Priya Sharma",role:"Vault Administrator",
     device:"ThinkPad #C3301",loc:"192.168.1.67",last:"20:12:08"},
  ];
  return (
    <div className="fade" style={{ padding:28, maxWidth:900 }}>
      <div style={{ color:C.muted, fontFamily:SANS, fontSize:11, marginBottom:4 }}>
        Dashboard › Access Control
      </div>
      <h1 style={{ margin:"0 0 20px", color:C.text, fontFamily:SANS, fontSize:20, fontWeight:600 }}>
        Access Control
      </h1>
      <div style={{ background:C.amberBg, border:"1px solid rgba(245,158,11,.25)",
        borderRadius:6, padding:"10px 16px", marginBottom:20,
        color:C.amber, fontFamily:SANS, fontSize:12,
        display:"flex", alignItems:"center", gap:10 }}>
        ⚠&nbsp; Individual credentials only. Shared Super-Admin accounts are prohibited by security policy.
      </div>
      <div style={{ background:C.bgCard, border:`1px solid ${C.border}`,
        borderRadius:8, overflow:"hidden" }}>
        <div style={{ display:"grid",
          gridTemplateColumns:"1.2fr 1fr 1fr 1fr 90px",
          padding:"9px 16px", borderBottom:`1px solid ${C.border}`,
          color:C.muted, fontFamily:MONO, fontSize:9, letterSpacing:1 }}>
          {["NAME / ROLE","DEVICE FINGERPRINT","LOCATION","LAST LOGIN","STATUS"].map(h=>(
            <span key={h}>{h}</span>
          ))}
        </div>
        {admins.map((a,i)=>(
          <div key={i} className="row" style={{ display:"grid",
            gridTemplateColumns:"1.2fr 1fr 1fr 1fr 90px",
            padding:"13px 16px",
            borderBottom:i<admins.length-1?`1px solid ${C.border}`:"none",
            alignItems:"center", transition:"background .11s" }}>
            <div>
              <div style={{ color:C.text, fontFamily:SANS, fontSize:12, fontWeight:600 }}>
                {a.name}
              </div>
              <div style={{ color:C.muted, fontFamily:SANS, fontSize:11 }}>{a.role}</div>
            </div>
            <span style={{ color:C.muted, fontFamily:MONO, fontSize:10 }}>{a.device}</span>
            <span style={{ color:C.muted, fontFamily:MONO, fontSize:10 }}>{a.loc}</span>
            <span style={{ color:C.muted, fontFamily:SANS, fontSize:11 }}>{a.last}</span>
            <span style={{ background:C.greenBg, color:C.green, fontFamily:MONO,
              fontSize:9, fontWeight:700, letterSpacing:1,
              padding:"3px 9px", borderRadius:3, display:"inline-block" }}>ACTIVE</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── AUDIT TRAILS ───────────────────────────────────────── */
function AuditPage({ log }) {
  return (
    <div className="fade" style={{ padding:28, maxWidth:880 }}>
      <div style={{ color:C.muted, fontFamily:SANS, fontSize:11, marginBottom:4 }}>
        Dashboard › Audit Trails
      </div>
      <h1 style={{ margin:"0 0 22px", color:C.text, fontFamily:SANS, fontSize:20, fontWeight:600 }}>
        Audit Trails
      </h1>
      <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:8, padding:22 }}>
        <div style={{ color:C.muted, fontFamily:SANS, fontSize:11, marginBottom:14 }}>
          {log.length} events · Immutable append-only log
        </div>
        {log.map((e,i)=><LogLine key={i} e={e}/>)}
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────── */
export default function ExamVaultSys() {
  useStyles();
  const [page,setPage]=useState("dash");
  const [cd,setCd]=useState(4*60+32);
  const [vault,setVault]=useState(SEED_VAULT);
  const [log,setLog]=useState(SEED_LOG);

  useEffect(()=>{
    const t=setInterval(()=>setCd(c=>Math.max(0,c-1)),1000);
    return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    const msgs=["Heartbeat: vault seals intact","Session token rotated","Telemetry snapshot saved"];
    let i=0;
    const t=setInterval(()=>{
      setLog(l=>[{t:new Date().toLocaleTimeString(),msg:msgs[i%msgs.length],lvl:"info"},...l].slice(0,60));
      i++;
    },14000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div style={{ background:C.bg, color:C.text, fontFamily:SANS,
      width:"100vw", height:"100vh", overflow:"hidden" }}>
      <StatusBar cd={cd}/>
      <Sidebar active={page} onNav={setPage}/>
      <main style={{ position:"fixed", top:52, left:220, right:0, bottom:0, overflow:"auto" }}>
        {page==="dash"   && <DashPage vault={vault} log={log} onNav={setPage}/>}
        {page==="vault"  && <VaultPage vault={vault} onNav={setPage}/>}
        {page==="submit" && <SubmitPage
          onAdd={p=>setVault(v=>[p,...v])}
          onAudit={e=>setLog(l=>[e,...l])}/>}
        {page==="access" && <AccessPage/>}
        {page==="audit"  && <AuditPage log={log}/>}
        {page==="cfg"    && <div style={{ padding:28, color:C.muted, fontFamily:SANS, fontSize:14 }}>
          System Settings — coming soon</div>}
      </main>
    </div>
  );
}
