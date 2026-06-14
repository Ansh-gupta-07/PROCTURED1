# HOPE OS: Secure Examination Kiosk 🛡️

**HOPE OS** is a cutting-edge, hybrid examination kiosk application designed for high-stakes testing environments (like NEET, JEE, etc.). It combines a highly responsive **Vite + React** web frontend with a **Python GTK4** native Linux wrapper to enforce a secure, zero-escape kiosk mode.

## 🚀 Key Features

- **Zero-Knowledge Encryption Vault**: Exam payloads are stored locally in Base64 and double-encrypted using simulated **ChaCha20 + AES-256-GCM**.
- **Dual-Key Decryption Gateway**: Requires two separate administrative keys (Authority Key + Framing Key) to unlock the exam questions.
- **Dynamic Set Allocation**: Secretly randomizes and assigns students SET-A, SET-B, or SET-C upon login.
- **Behavioral Proctoring Telemetry**: Tracks "Tab Switch Violations" and "Idle Warnings".
- **Anti-Tamper Checksum**: Generates a cryptographic SHA-256 hash of the student's submission payload to prevent modification.
- **Native GTK4 Kiosk Wrapper**: (Linux only) A Python script that uses WebKit and PyGObject to spawn a fullscreen borderless window that intercepts escape keys.

---

## 🛠️ Tech Stack
- **Frontend Engine**: React, Vite, JavaScript/TypeScript
- **Styling**: Vanilla CSS (Custom Design Tokens, CRT Animations, Glassmorphism)
- **Cryptography**: CryptoJS
- **Native Wrapper**: Python 3.11+, PyGObject (GTK4), WebKit2

---

## 💻 Setup & Installation

### 1. Web Frontend Setup
To run the primary web application locally:
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
Navigate to `http://localhost:5173` to interact with the OS simulation in your browser.

### 2. Native GTK4 Linux Wrapper Setup
If you are deploying this to a Linux examination machine, you can run the native GTK4 wrapper.
```bash
# Install system dependencies (Arch Linux example)
sudo pacman -S python-gobject gtk4 webkit2gtk

# Install Python requirements
pip install -r requirements.txt

# Launch the secure native wrapper (ensure Vite dev server is running, or build the bundle)
python hope_os_kiosk.py
```

---

## 🔑 Test Credentials
To test the application, use the following credentials:

**Vault Unlock Keys:**
- Authority Key (ChaCha20): `NTA_AUTH_CHACHA_2026`
- Framing Key (AES-256): `HOPE_OS_MASTER_KEY_2026`

**Student Login Accounts:**
- Roll No: `20260101` | Pass: `password123`
- Roll No: `20260102` | Pass: `securepass456`
- Roll No: `admin`    | Pass: `admin`

**Admin Dashboard Key:**
- To decode the submitted student payloads at the end of the test, click "NTA Admin Override" on the login screen and use Key: `HOPE2026`
