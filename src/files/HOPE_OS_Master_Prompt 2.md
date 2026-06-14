# HOPE OS — Secure Exam Kiosk Application
## Master Build Prompt & Architecture Document
### GTK4 + Python | Arch Linux Custom OS

---

> **How to use this document:** Feed this entire prompt to an AI coding assistant
> (Claude, GPT-4, Gemini) to generate the full Python GTK4 application. Every
> screen, security rule, and file is specified below. You can also use it as your
> team's technical specification document.

---

## PART 1 — PROJECT OVERVIEW

You are an expert Python + GTK4 developer and Linux systems engineer. Build a
**production-ready, secure examination kiosk application** called **HOPE OS** for
a custom Arch Linux environment. The app is the **only** user-facing program on
the system — it must take over the entire screen and refuse to let the user
escape.

### Core Constraints
- Built with **Python 3.11+** and **GTK4** (PyGObject)
- Runs inside **cage** (Wayland kiosk compositor) — no window decorations,
  no taskbar, no escape
- Works **100% offline** — no internet dependency whatsoever
- All file paths are absolute, targeting `/opt/exam-app/`
- The app must be robust enough to run on real exam center hardware

---

## PART 2 — VISUAL DESIGN SPECIFICATION

### Design Tokens
```
Background (main):   #0A0F1E   ← deep navy
Background (dark):   #050A12   ← darker panels
Background (card):   #0D1526   ← card/panel bg
Accent (primary):    #00C8C8   ← electric teal
Text (primary):      #E8EDF5   ← cold white
Text (muted):        #4A5568   ← muted gray
Border:              #1A2540   ← dark blue border
Error:               #E25555   ← soft red
Font:                JetBrains Mono (monospace, all weights)
```

### GTK4 CSS Theme File (`/opt/exam-app/assets/style.css`)
```css
/* Load font */
@import url("file:///opt/exam-app/assets/JetBrainsMono.ttf");

* {
  font-family: 'JetBrains Mono', monospace;
  color: #E8EDF5;
}

window, .main-bg {
  background-color: #0A0F1E;
}

.panel-dark { background-color: #050A12; }
.panel-card { background-color: #0D1526; }

.label-teal { color: #00C8C8; }
.label-muted { color: #4A5568; }
.label-error { color: #E25555; }

.entry-terminal {
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #00C8C8;
  border-radius: 0;
  color: #E8EDF5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  padding: 8px 4px;
}
.entry-terminal:focus { border-bottom: 2px solid #00C8C8; }

.btn-teal {
  background: transparent;
  border: 1px solid #00C8C8;
  color: #00C8C8;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  letter-spacing: 2px;
  padding: 10px 24px;
  border-radius: 0;
}
.btn-teal:hover { background: rgba(0,200,200,0.10); }

.btn-solid-teal {
  background: #00C8C8;
  border: none;
  color: #050A12;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2px;
  padding: 12px 32px;
  border-radius: 0;
}
.btn-solid-teal:hover { opacity: 0.85; }

.status-bar {
  background: #050A12;
  border-bottom: 1px solid #00C8C8;
  padding: 6px 18px;
}

.question-row {
  border-left: 3px solid transparent;
  border-bottom: 1px solid #1A2540;
  padding: 10px 12px;
}
.question-row.active {
  background: rgba(0,200,200,0.07);
  border-left: 3px solid #00C8C8;
}
.question-row:hover { background: rgba(0,200,200,0.04); cursor: pointer; }

.answer-box {
  background: #050A12;
  border: 1px solid #1A2540;
  border-radius: 0;
  color: #E8EDF5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  padding: 14px;
}
.answer-box:focus { border-color: #00C8C8; }

.rule-box {
  background: #050A12;
  border: 1px solid #1A2540;
  border-left: 3px solid #00C8C8;
  padding: 18px 20px;
}

.login-card {
  background: #0D1526;
  border: 1px solid #00C8C8;
  padding: 46px 38px;
}

.bottom-bar {
  background: #050A12;
  border-top: 1px solid #1A2540;
  padding: 4px 14px;
}

.dot-answered {
  background: #00C8C8;
  border-radius: 50%;
}
.dot-unanswered {
  background: #4A5568;
  border-radius: 50%;
}
```

---

## PART 3 — APPLICATION SCREENS (FULL SPECIFICATION)

The app uses a **GtkStack** with crossfade transitions (400ms) to switch between screens.

---

### SCREEN 1 — Login

**Widget**: `LoginView(Gtk.Box)`

**Layout** (centered card, 370px wide):
```
┌─────────────────────────────────────┐
│ ◤                               ◥  │  ← CSS corner decorations (teal)
│                                     │
│         H O P E   O S              │  ← 28px bold teal, letter-spacing: 8px
│   [ SECURE KIOSK ENVIRONMENT ]      │  ← 10px muted gray
│                                     │
│  > USERNAME ──────────────────────  │  ← label + Entry (terminal style)
│                                     │
│  > PASSWORD ──────────────────────  │  ← Entry (visibility=False)
│                                     │
│  ⚠ ACCESS DENIED: credentials req. │  ← Error label (hidden by default)
│                                     │
│  ┌─────────────────────────────┐   │
│  │     > AUTHENTICATE          │   │  ← teal border button
│  └─────────────────────────────┘   │
│                                     │
│ ◣                               ◢  │
└─────────────────────────────────────┘
```

**Logic**:
```python
def on_authenticate(self):
    uid = self.uid_entry.get_text().strip()
    pwd = self.pwd_entry.get_text().strip()
    if not uid or not pwd:
        self.show_error("ACCESS DENIED: credentials required")
        return
    if self.verify_credentials(uid, pwd):
        self.app.session_user = uid
        self.app.switch_to("instructions")
    else:
        self.shake_card()          # CSS animation: shake effect
        self.show_error(f"ACCESS DENIED: invalid credentials [{self.strikes}/3]")
        self.strikes += 1
        if self.strikes >= 3:
            self.lockout()         # 5-minute lockout after 3 failures

def verify_credentials(self, uid, pwd):
    # Read encrypted credentials from /opt/exam-app/data/students.enc
    # Decrypt with GPG using the system public key
    # Compare uid:hashed_password
    ...

def shake_card(self):
    # Apply shake CSS animation class, remove after 500ms
    ...
```

**Pre-fill behavior**: The app reads the current Linux username from
`os.environ.get('USER')` or `pwd.getpwuid(os.getuid()).pw_name` and pre-fills
the username field. The field remains editable so the student can correct it.

---

### SCREEN 2 — Examination Instructions & Declaration

**Widget**: `InstructionsView(Gtk.Box)`

**Layout**:
```
╔══════════════════════════════════════╗
║  EXAMINATION BRIEFING                ║  ← teal heading
╠══════════════════════════════════════╣
║                                      ║
║  ┌─ Rules Terminal Box ─────────────┐║
║  │ 01. Read each question carefully.│║
║  │ 02. Answers auto-save every 30s. │║
║  │ 03. Do not power off the system. │║
║  │ 04. Malpractice = disqualified.  │║
║  │ 05. Timer starts immediately.    │║
║  │ 06. Click START when ready.      │║
║  └──────────────────────────────────┘║
║                                      ║
║  🔒 Screen monitoring is active      ║
║                                      ║
║  Session auto-begins in [60]s        ║  ← live countdown
║                                      ║
║  ☐ I have read and understood        ║  ← CheckButton (must tick)
║    the examination instructions      ║
║                                      ║
║  [ > BEGIN EXAMINATION ]             ║  ← disabled until checkbox ticked
╚══════════════════════════════════════╝
```

**Logic**:
```python
def __init__(self):
    self.countdown = 60
    self.timer_id = GLib.timeout_add(1000, self.tick)

def tick(self):
    self.countdown -= 1
    self.countdown_label.set_text(
        f"Session will auto-begin in {self.countdown}s"
    )
    if self.countdown <= 0:
        self.app.switch_to("exam")
        return GLib.SOURCE_REMOVE
    return GLib.SOURCE_CONTINUE

def on_agree_toggled(self, checkbutton):
    self.start_btn.set_sensitive(checkbutton.get_active())

def on_begin(self):
    GLib.source_remove(self.timer_id)  # stop auto countdown
    self.app.start_exam_timer()
    self.app.switch_to("exam")
```

---

### SCREEN 3 — Main Examination Interface

**Widget**: `ExamView(Gtk.Box)`

**Layout** (two-panel):
```
┌─ STATUS BAR ──────────────────────────────────────────────────────┐
│  HOPE OS  ●SECURE   [student_id]   Time Remaining: 02:58:44  [LOG]│
└───────────────────────────────────────────────────────────────────┘
┌─ NAVIGATOR (36%) ─┬─────── ANSWER PANE (64%) ───────────────────┐
│ QUESTION NAVIGATOR│ QUESTION 1 / 5            3 answered         │
│                   ├────────────────────────────────────────────── │
│ ● Q1  What is... │ ┌─────────────────────────────────────────┐   │
│ ○ Q2  Explain... │ │ What is the primary function of an OS? │   │
│ ○ Q3  What is... │ └─────────────────────────────────────────┘   │
│ ● Q4  Define...  │                                                │
│ ○ Q5  What is... │ > YOUR RESPONSE:                              │
│                   │ ┌─────────────────────────────────────────┐   │
│                   │ │                                         │   │
│                   │ │  (student types answer here)            │   │
│                   │ │                                         │   │
│                   │ └─────────────────────────────────────────┘   │
│                   │                                                │
│                   │ [SAVE RESPONSE]          Last saved: 14:32:01 │
└───────────────────┴────────────────────────────────────────────── ┘
┌─ BOTTOM STATUS ───────────────────────────────────────────────────┐
│ ● AUTO-SAVE: ACTIVE  ● GPG: ARMED  ● ANSWERED: 3/5               │
└───────────────────────────────────────────────────────────────────┘
```

**Timer Logic**:
```python
def start_exam_timer(self, duration_seconds=10800):  # 3 hours default
    self.remaining = duration_seconds
    self.timer_id = GLib.timeout_add(1000, self.update_timer)

def update_timer(self):
    self.remaining -= 1
    h, m, s = self.remaining // 3600, (self.remaining % 3600) // 60, self.remaining % 60
    self.timer_label.set_text(f"Time Remaining: {h:02d}:{m:02d}:{s:02d}")
    if self.remaining <= 300:   # 5-minute warning
        self.timer_label.add_css_class("label-error")
    if self.remaining <= 0:
        self.auto_submit()
    return GLib.SOURCE_CONTINUE
```

**Auto-save Logic** (GPG encrypted):
```python
def autosave(self):
    """Called every 30 seconds via GLib.timeout_add"""
    answers = self.collect_answers()  # dict {q_id: answer_text}
    payload = json.dumps({
        "student_id": self.app.session_user,
        "timestamp": datetime.now().isoformat(),
        "answers": answers,
        "exam_set": self.app.exam_set  # "A", "B", or "C"
    })
    self.encrypt_and_save(payload)

def encrypt_and_save(self, payload: str):
    """GPG public-key encrypt the answer payload"""
    import subprocess
    result = subprocess.run(
        ["gpg", "--batch", "--yes", "--trust-model", "always",
         "--recipient", self.app.gpg_recipient_key,
         "--encrypt", "--output", "/tmp/answers.enc"],
        input=payload.encode(),
        capture_output=True
    )
    if result.returncode == 0:
        shutil.copy("/tmp/answers.enc",
                    f"/var/exam-data/{self.app.session_user}_answers.enc")
        self.saved_label.set_text(f"Last saved: {datetime.now().strftime('%H:%M:%S')}")
```

**Question Loading** (from encrypted JSON):
```python
def load_questions(self):
    """Decrypt and load the question paper on exam start"""
    import subprocess
    # Outer layer: ChaCha20 (Exam Authority key)
    # Inner layer: AES-256-GCM (Paper Framing key)
    # Both keys entered by authorized personnel before exam starts
    result = subprocess.run(
        ["gpg", "--batch", "--passphrase", self.app.decrypt_key,
         "--decrypt", "/opt/exam-app/data/questions.enc"],
        capture_output=True
    )
    data = json.loads(result.stdout)
    self.questions = data["questions"]
    self.exam_set = data["set"]  # A, B, or C
    self.exam_duration = data["duration_seconds"]
```

---

### SCREEN 4 — Submission & Encryption

**Widget**: `SubmitView(Gtk.Box)` — shown after timer ends or student clicks Submit

**Layout**:
```
╔══════════════════════════════════════════╗
║                                          ║
║     EXAMINATION COMPLETE                 ║  ← teal heading
║                                          ║
║  ✓ All answers have been encrypted       ║
║  ✓ File ready for admin collection       ║
║                                          ║
║  Student ID:  exam2026-042               ║
║  Submitted:   14:52:33                   ║
║  Questions:   5/5 answered               ║
║  File:        exam2026-042_answers.enc   ║
║                                          ║
║  ┌──────────────────────────────────┐   ║
║  │  Insert Admin Collection USB     │   ║  ← waiting indicator
║  └──────────────────────────────────┘   ║
║                                          ║
║  [ COPY TO USB & SHUTDOWN ]              ║  ← final action
╚══════════════════════════════════════════╝
```

**Logic**:
```python
def on_submit(self):
    # 1. Final save + encrypt
    self.exam_view.encrypt_and_save(self.exam_view.collect_answers())
    # 2. Switch to submission screen
    self.app.switch_to("submit")
    # 3. Watch for USB insertion
    self.monitor = Gio.VolumeMonitor.get()
    self.monitor.connect("mount-added", self.on_usb_inserted)

def on_usb_inserted(self, monitor, mount):
    mount_path = mount.get_default_location().get_path()
    src = f"/var/exam-data/{self.app.session_user}_answers.enc"
    dst = f"{mount_path}/{self.app.session_user}_answers.enc"
    shutil.copy(src, dst)
    self.status_label.set_text("✓ File copied to USB. Safe to remove.")
    GLib.timeout_add(3000, self.shutdown)

def shutdown(self):
    subprocess.run(["systemctl", "poweroff"])
```

---

## PART 4 — SECURITY ARCHITECTURE

### Encryption Chain

```
QUESTION PAPER (plaintext JSON)
         │
         ▼ Layer 1: AES-256-GCM
         │ Key: Paper Framing In-Charge password
         ▼
INTERMEDIATE CIPHERTEXT
         │
         ▼ Layer 2: ChaCha20-Poly1305
         │ Key: Exam Conducting Authority password
         ▼
questions.enc (stored in /opt/exam-app/data/)
         │
         ▼ Decryption Day (reverse order):
         │ Step 1: ChaCha20 key entered by Authority
         │ Step 2: AES-256-GCM key entered by In-Charge
         ▼
PLAINTEXT QUESTIONS (in memory only, never written to disk)
```

### Answer Encryption
```
STUDENT ANSWERS (JSON payload)
         │
         ▼ GPG Public Key Encryption (RSA-4096 or Ed25519)
         │ Public key baked into OS at /opt/exam-app/data/exam-public.gpg
         │ Private key: held ONLY by NTA/exam authority (never on exam machines)
         ▼
student_id_answers.enc → USB → NTA office → GPG private key decrypt
```

### Admin Lockdown
- `exam-kiosk` system user has no sudo rights
- No shell (`/sbin/nologin` or `/bin/false` as shell)
- `cage` kiosk prevents all keyboard escapes (Alt+F4, Ctrl+Alt+T, Super key, etc.)
- `iptables` blocks all network traffic (INCOMING + OUTGOING DROP)
- Filesystem: `/opt/exam-app/data/` is read-only mounted
- `/proc` and `/sys` hidden from user namespace

### Credential Verification (PAM Method)
```python
import pam

def verify_credentials(self, username: str, password: str) -> bool:
    """Verify against Linux PAM without storing passwords"""
    p = pam.pam()
    return p.authenticate(username, password, service='login')
```

---

## PART 5 — FILE STRUCTURE

```
/opt/exam-app/
├── main.py                    # Entry point, App class, GtkApplication
├── views/
│   ├── __init__.py
│   ├── login.py               # LoginView (Screen 1)
│   ├── instructions.py        # InstructionsView (Screen 2)
│   ├── exam.py                # ExamView (Screen 3)
│   └── submit.py              # SubmitView (Screen 4)
├── core/
│   ├── __init__.py
│   ├── crypto.py              # GPG encrypt/decrypt wrappers
│   ├── autosave.py            # Auto-save thread/GLib timer
│   ├── logger.py              # Activity audit logger
│   └── credentials.py        # PAM credential verification
├── assets/
│   ├── style.css              # GTK4 CSS theme (full file above)
│   ├── JetBrainsMono.ttf      # Font (bundled offline)
│   └── exam-public.gpg        # GPG public key (baked in)
└── data/
    ├── questions.enc           # Double-encrypted question paper
    └── students.enc            # GPG-encrypted student credential list

/var/exam-data/                 # Answer files (written by app, readable by root only)
    └── {student_id}_answers.enc
```

---

## PART 6 — MAIN ENTRY POINT (`main.py`)

```python
#!/usr/bin/env python3
"""
HOPE OS — Secure Examination Kiosk
Entry point and application controller
"""
import gi
gi.require_version('Gtk', '4.0')
gi.require_version('Adw', '1')
from gi.repository import Gtk, Adw, GLib, Gio
import os, sys, logging
from pathlib import Path

# Views
from views.login import LoginView
from views.instructions import InstructionsView
from views.exam import ExamView
from views.submit import SubmitView

APP_ID = "org.hopeos.kiosk"
APP_DIR = Path("/opt/exam-app")

class HopeOSApp(Adw.Application):
    def __init__(self):
        super().__init__(application_id=APP_ID)
        self.session_user = None
        self.exam_set = None
        self.gpg_recipient_key = "exam-authority@hopeos.local"
        self.connect("activate", self.on_activate)

    def on_activate(self, app):
        # Load CSS
        css_provider = Gtk.CssProvider()
        css_provider.load_from_path(str(APP_DIR / "assets" / "style.css"))
        Gtk.StyleContext.add_provider_for_display(
            self.props.active_window.get_display() if self.props.active_window
            else Gdk.Display.get_default(),
            css_provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )

        # Main window (fullscreen, no decorations)
        self.window = Gtk.ApplicationWindow(application=self)
        self.window.set_title("HOPE OS")
        self.window.fullscreen()
        self.window.set_decorated(False)

        # Stack for screen switching
        self.stack = Gtk.Stack()
        self.stack.set_transition_type(Gtk.StackTransitionType.CROSSFADE)
        self.stack.set_transition_duration(400)

        # Build screens
        self.login_view       = LoginView(self)
        self.instructions_view = InstructionsView(self)
        self.exam_view        = ExamView(self)
        self.submit_view      = SubmitView(self)

        self.stack.add_named(self.login_view, "login")
        self.stack.add_named(self.instructions_view, "instructions")
        self.stack.add_named(self.exam_view, "exam")
        self.stack.add_named(self.submit_view, "submit")

        self.window.set_child(self.stack)
        self.window.present()

        # Start at login
        self.switch_to("login")

    def switch_to(self, screen_name: str):
        self.stack.set_visible_child_name(screen_name)

    def start_exam_timer(self):
        self.exam_view.start_timer()

if __name__ == "__main__":
    app = HopeOSApp()
    sys.exit(app.run(sys.argv))
```

---

## PART 7 — QUESTION PAPER FORMAT (JSON Schema)

```json
{
  "set": "A",
  "subject": "Computer Science",
  "duration_seconds": 10800,
  "total_marks": 100,
  "instructions": "Answer all questions. Each question carries equal marks.",
  "questions": [
    {
      "id": 1,
      "text": "Explain the role of the operating system kernel in memory management.",
      "marks": 20,
      "type": "long_answer",
      "topic": "Operating Systems",
      "difficulty": "hard"
    },
    {
      "id": 2,
      "text": "Define encryption. Differentiate between AES-256-GCM and ChaCha20-Poly1305.",
      "marks": 20,
      "type": "long_answer",
      "topic": "Cryptography",
      "difficulty": "medium"
    }
  ]
}
```

---

## PART 8 — DEPENDENCIES (packages.x86_64)

Add these to your Arch ISO package list:
```
# GTK4 Application Runtime
python
python-gobject
gtk4
libadwaita
python-pam
python-cryptography

# Fonts (bundled, but keep system fonts as fallback)
ttf-dejavu
ttf-liberation

# Encryption
gnupg
python-gnupg

# Kiosk Display
cage
xorg-xwayland

# System integration
dbus
at-spi2-core
```

---

## PART 9 — SYSTEM INTEGRATION (kiosk auto-launch)

### `/etc/skel/.bash_profile` (auto-start on login)
```bash
if [ -z "$DISPLAY" ] && [ "$(tty)" = "/dev/tty1" ]; then
    exec cage -- python3 /opt/exam-app/main.py
fi
```

### Pre-exam Admin Script (`/root/prepare-exam.sh`)
```bash
#!/bin/bash
# Run BEFORE exam day to load question paper into vault

echo "=== HOPE OS Exam Preparation ==="
echo "Step 1: Enter Paper Framing In-Charge password:"
read -s KEY1

echo "Step 2: Enter Exam Authority password:"
read -s KEY2

echo "Step 3: Provide path to plaintext question JSON:"
read QPATH

# Encrypt in two layers
openssl enc -aes-256-gcm -k "$KEY1" -in "$QPATH" -out /tmp/layer1.enc
openssl enc -chacha20 -k "$KEY2" -in /tmp/layer1.enc -out /opt/exam-app/data/questions.enc
rm -f /tmp/layer1.enc

echo "✓ Questions encrypted and stored in vault."
echo "✓ Both keys are required to decrypt on exam day."
```

### Exam Day Decryption Script (`/root/unlock-exam.sh`)
```bash
#!/bin/bash
# Run ON exam day to unlock questions

echo "Step 1: Exam Authority enters their key:"
read -s KEY2
echo "Step 2: Paper Framing In-Charge enters their key:"
read -s KEY1

openssl enc -chacha20 -d -k "$KEY2" -in /opt/exam-app/data/questions.enc -out /tmp/layer1.dec
openssl enc -aes-256-gcm -d -k "$KEY1" -in /tmp/layer1.dec -out /tmp/questions_unlocked.json
rm /tmp/layer1.dec

echo "✓ Questions decrypted. Exam is ready to begin."
# The GTK app reads /tmp/questions_unlocked.json at launch
```

---

## PART 10 — POST-EXAM COLLECTION

### Admin collection flow (no shell access needed):
1. Student clicks **Submit Examination** 
2. App encrypts final answer file with GPG public key
3. App shows: *"Insert Admin Collection USB"*
4. Admin inserts USB (app auto-detects via `Gio.VolumeMonitor`)
5. App copies `{student_id}_answers.enc` to USB
6. App shows: *"✓ File copied. USB may be safely removed."*
7. App runs `systemctl poweroff` after 5 seconds

### At NTA/Authority Office:
```bash
# Decrypt student answer file with GPG private key
gpg --import exam-private-key.gpg
gpg --decrypt exam2026-042_answers.enc > exam2026-042_answers.json
```

---

## PART 11 — SECURITY HARDENING CHECKLIST

After building the ISO, verify:

```
[ ] cage running as kiosk compositor (no Alt+Tab, no window switching)
[ ] NetworkManager disabled (systemctl disable NetworkManager)
[ ] Bluetooth disabled (systemctl disable bluetooth)
[ ] USB storage auto-mount disabled EXCEPT via the app's Gio.VolumeMonitor
[ ] exam-kiosk user cannot run sudo
[ ] exam-kiosk user shell = /sbin/nologin
[ ] /proc/sysrq-trigger write-protected
[ ] Virtual TTYs 2-6 disabled (remove getty@tty2..6 services)
[ ] Screen lock / screensaver disabled (app must stay visible always)
[ ] AppArmor profile applied to /opt/exam-app/main.py
[ ] iptables INPUT DROP, OUTPUT DROP (except USB reads)
[ ] GPG public key fingerprint verified before deployment
```

---

## PART 12 — FUTURE ROADMAP (ZK Semantic Vault)

### Phase 2 features to implement after MVP:
- **Semantic Similarity Check**: Use `sentence-transformers` (offline model) to
  detect near-duplicate questions before vault storage
- **Zero-Knowledge Proof layer**: Verify paper integrity without decrypting
- **Shamir's Secret Sharing**: Split master key into 3 shares — any 2 unlock
- **Anti-tamper barcode**: QR code bound to SHA-256 hash of each printed bundle
- **Behavioral telemetry**: Log keystrokes-per-minute, idle time, window focus
  events to `audit.log` for post-exam analysis

---

*Generated for: HOPE OS Secure Examination Kiosk Project*
*Stack: Arch Linux + cage + Python 3.11 + GTK4 + PyGObject + GPG*
*License: MIT — Free to use for educational examination infrastructure*
