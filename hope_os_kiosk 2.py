import sys
import os
import signal

import gi
gi.require_version('Gtk', '4.0')
gi.require_version('WebKit', '6.0')
from gi.repository import Gtk, WebKit, GLib, Gdk

class HopeOSKiosk(Gtk.Application):
    def __init__(self):
        super().__init__(application_id='com.exam.hopeos')
        GLib.set_prgname('HOPE OS Kiosk')

    def do_activate(self):
        # Create the main window
        self.window = Gtk.ApplicationWindow(application=self)
        self.window.set_title('HOPE OS - Secure Examination Kiosk')
        self.window.set_default_size(1024, 768)
        
        # Enforce Lockdown Mode
        self.window.set_decorated(False)
        self.window.fullscreen()

        # Capture and drop escape keys at the window level
        key_controller = Gtk.EventControllerKey.new()
        key_controller.connect("key-pressed", self.on_key_pressed)
        self.window.add_controller(key_controller)

        # Initialize WebKit Webview
        self.webview = WebKit.WebView()
        
        # Configure WebKit Settings for Kiosk Mode
        settings = self.webview.get_settings()
        settings.set_enable_developer_extras(False) # Disable inspector
        settings.set_enable_html5_local_storage(True)
        settings.set_javascript_can_open_windows_automatically(False)
        self.webview.set_settings(settings)

        # Disable context menus to prevent inspection/reloading
        self.webview.connect("context-menu", self.on_context_menu)

        # Load the React application
        # If 'dist' exists, serve it via a local Python HTTP server in a daemon thread.
        # Otherwise, fall back to the Vite dev server at localhost:5173
        dist_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')
        if os.path.exists(dist_path):
            import threading
            import http.server
            import socketserver
            import random

            port = random.randint(8000, 9000)
            class Handler(http.server.SimpleHTTPRequestHandler):
                def __init__(self, *args, **kwargs):
                    super().__init__(*args, directory=dist_path, **kwargs)

            httpd = socketserver.TCPServer(("", port), Handler)
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            target_url = f"http://127.0.0.1:{port}"
            print(f"[BOOT] Serving production build from {dist_path} at {target_url}")
        else:
            target_url = os.environ.get("HOPE_URL", "http://localhost:5173")
            print(f"[BOOT] Running in development mode using {target_url}")

        self.webview.load_uri(target_url)

        # Add webview to window
        self.window.set_child(self.webview)
        self.window.present()

    def on_key_pressed(self, controller, keyval, keycode, state):
        # Block common escape keys before they reach the OS or Webview
        # Block Alt+F4
        if keyval == Gdk.KEY_F4 and (state & Gdk.ModifierType.ALT_MASK):
            print("[SECURITY] Blocked Alt+F4")
            return True # Event handled, stop propagation
            
        # Block Super/Windows key
        if keyval in [Gdk.KEY_Super_L, Gdk.KEY_Super_R]:
            print("[SECURITY] Blocked Super Key")
            return True
            
        # Block F11 (Fullscreen toggle)
        if keyval == Gdk.KEY_F11:
            print("[SECURITY] Blocked F11")
            return True

        return False # Let other keys pass through

    def on_context_menu(self, webview, context_menu, event, hit_test_result):
        # Clear the right-click context menu entirely
        context_menu.remove_all()
        return False

def main():
    # Handle OS signals to cleanly exit if needed by admin script
    signal.signal(signal.SIGINT, signal.SIG_DFL)
    
    app = HopeOSKiosk()
    exit_status = app.run(sys.argv)
    sys.exit(exit_status)

if __name__ == '__main__':
    main()
