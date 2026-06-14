const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    kiosk: true, // Forces fullscreen, hides dock, disables mission control
    autoHideMenuBar: true,
    alwaysOnTop: true, // Keeps it above other windows
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Load the React compiled index.html
  win.loadFile(path.join(__dirname, 'dist', 'index.html'))

  // Prevent closing the window easily
  win.on('close', (e) => {
    // In a real kiosk you would prevent this, but we allow it for development
    // e.preventDefault()
  })
}

app.whenReady().then(() => {
  createWindow()

  // Block dangerous shortcuts (e.g., refreshing, devtools)
  globalShortcut.register('CommandOrControl+R', () => {
    console.log('CommandOrControl+R is pressed: Shortcut Disabled')
  })
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    console.log('CommandOrControl+Shift+I is pressed: Shortcut Disabled')
  })
  globalShortcut.register('F11', () => {
    console.log('F11 is pressed: Shortcut Disabled')
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
