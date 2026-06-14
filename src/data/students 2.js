// Mock Student Database
// In a real HOPE OS environment, this would be an encrypted file (e.g., students.enc)
// verified via GPG and PAM (Pluggable Authentication Modules).

export const VALID_STUDENTS = {
  "20260101": {
    name: "Aditi Singh",
    password: "password123"
  },
  "20260102": {
    name: "Ansh Gupta",
    password: "securepass456"
  },
  "admin": {
    name: "System Admin",
    password: "admin"
  }
};
