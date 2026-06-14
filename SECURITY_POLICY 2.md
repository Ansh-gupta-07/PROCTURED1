# Security & Anti-Cheating Policy 🔐

HOPE OS is designed with a defense-in-depth security model to ensure the integrity of high-stakes examinations. The system employs both cryptographic security and behavioral proctoring.

## 1. Zero-Knowledge Cryptographic Vault
Exam payloads are never stored in plaintext on the disk. They are compiled into Base64 strings and stored in `vault.js`.

- **Dual-Key Decryption**: To prevent a single point of compromise, the system requires two distinct keys to unlock the vault.
  - **Authority Key**: Simulates the outer layer of ChaCha20 encryption.
  - **Framing Key**: Simulates the inner layer of AES-256-GCM encryption.
- **In-Memory Storage**: Once decrypted, the payload exists *strictly* in React application state (RAM). If the kiosk loses power or the window is closed, the plaintext questions are instantly wiped.

## 2. Dynamic Question Allocation
Instead of distributing static sets, HOPE OS randomly assigns candidates `SET-A`, `SET-B`, or `SET-C` at the moment of login. This makes pre-planned cheating rings obsolete, as students cannot predict which set they will receive until they are actively authenticated in the testing room.

## 3. Behavioral Proctoring Engine (Telemetry)
The application actively monitors the candidate's behavior to detect unauthorized activity:

1. **Focus Tracking**: The system listens to the `visibilitychange` API. If the student attempts to switch tabs, minimize the window, or if a secondary application steals focus, a `TAB SWITCH VIOLATION` is immediately logged.
2. **Idle Tracking**: To prevent candidates from reading questions to external cameras or leaving the terminal, the system monitors `mousemove` and `keydown` events. Inactivity beyond the threshold logs an `IDLE WARNING`.

## 4. Anti-Tamper Checksums
At the conclusion of the exam, the system bundles the student's answers, metadata (duration, roll number), and the array of Telemetry Violations into a single payload.
- Before "saving to USB", a **SHA-256 Checksum** of this payload is generated.
- The Admin Dashboard uses this checksum to mathematically prove that the submission file was not tampered with between the student's machine and the evaluation server.

## 5. Native OS Lockdown (Linux)
When deployed using the Python GTK4 wrapper and `cage` compositor:
- **No Window Manager Escapes**: The GTK window captures and drops `Alt+F4`, `Meta` keys, and context menus.
- **No Network Egress**: The application operates 100% offline. `iptables` rules drop all incoming and outgoing packets.
- **USB Whitelisting**: USB storage auto-mounting is disabled by the OS, and handled explicitly via `Gio.VolumeMonitor` only when the test is submitted.
