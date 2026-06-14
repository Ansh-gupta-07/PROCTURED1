# Architecture & Component Tree 🏗️

The HOPE OS project is uniquely structured as a hybrid application: a React (Vite) frontend simulating an OS environment, wrapped in a Python GTK4 container for deployment on locked-down Linux machines.

## 1. Web Frontend Architecture (React)

The frontend is a Single Page Application (SPA) utilizing conditional rendering to simulate OS-level application switching.

### Component Tree
```text
main.jsx
└── App.jsx (State Manager & Router)
    ├── BootScreen.jsx       (Mounts RAM disk & Vault Payload)
    ├── UnlockScreen.jsx     (Dual-Key Cryptographic Gateway)
    ├── LoginScreen.jsx      (PAM Authentication Simulation)
    ├── InstructionsScreen.jsx (Pre-flight Checks)
    ├── ExamScreen.jsx       (Main Test Interface)
    │   ├── StatusBar.jsx    (Top HUD: Timer, Set ID)
    │   └── BottomBar.jsx    (Bottom HUD: Answers, Save Status)
    ├── SubmitScreen.jsx     (SHA-256 Hashing & GPG Simulation)
    └── NtaDashboard.jsx     (Admin Submissions Review)
```

### State Management (`App.jsx`)
`App.jsx` acts as the single source of truth, managing:
1. **Screen State**: `screen`, `fadeClass` for crossfading between views.
2. **Vault State**: `decryptedVault`, `assignedSetId`, `submissionPayload`.
3. **Exam State**: `answers`, `timer`, `currentQ`.
4. **Telemetry State**: Tracks `visibilitychange` and idle time timeouts, injecting them into the `telemetryLogs` array.

## 2. Data Layer
- `src/data/vault.js`: Contains pre-compiled Base64 payloads simulating dual-encrypted question sets (SET-A, SET-B, SET-C).
- `src/data/students.js`: A mock dictionary representing an encrypted GPG student list for local authentication validation.

## 3. Python GTK4 Wrapper Architecture (Linux Native)

When deployed on the target examination machines (Arch Linux), the `hope_os_kiosk.py` script is executed via the `cage` Wayland compositor.

1. **PyGObject (GTK4)**: Initializes a `Gtk.Application` and a `Gtk.ApplicationWindow`.
2. **WebKit2Gtk**: Embeds a `WebKit.WebView` directly into the GTK window, pointing either to the local Vite Dev Server (for testing) or the compiled static `dist/` directory (for production).
3. **Window Management**: The GTK window is forced into `.fullscreen()` and `.set_decorated(False)` to strip away all OS chrome.
4. **Input Trapping**: The Python script binds to the `Gtk.EventControllerKey` to physically trap and discard `Alt+F4`, `Super` key presses, and `Ctrl+Alt+Delete` before they reach the window manager.
