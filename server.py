#!/usr/bin/env python3
"""
Miftah Laundry - Server HTTP dengan Dukungan Tunneling
"""

import http.server
import socketserver
import os
import webbrowser
import socket
import subprocess
import threading
import time
from pathlib import Path

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        extensions = {
            '.html': 'text/html',
            '.htm': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.webp': 'image/webp',
        }
        for ext, mime in extensions.items():
            if path.endswith(ext):
                return mime
        return 'application/octet-stream'

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return '127.0.0.1'

def start_ngrok(port):
    """Mencoba menjalankan ngrok secara otomatis"""
    try:
        print("\n  🔄 Mencoba menjalankan ngrok...")
        import subprocess
        import threading
        import time
        
        # Cek apakah ngrok terinstall
        subprocess.run(['ngrok', '--version'], capture_output=True, check=True)
        
        # Jalankan ngrok di background
        def run_ngrok():
            subprocess.run(['ngrok', 'http', str(port)], 
                         capture_output=False)
        
        thread = threading.Thread(target=run_ngrok, daemon=True)
        thread.start()
        
        time.sleep(3)
        print("  ✅ Ngrok berjalan di background")
        print("  📱 Buka https://dashboard.ngrok.com untuk melihat URL")
        return True
    except:
        print("  ❌ Ngrok tidak ditemukan. Install dengan: npm install -g ngrok")
        return False

def show_instructions(ip, port):
    print("\n" + "="*60)
    print("  🧺 MIFTAH LAUNDRY - SERVER BERJALAN")
    print("="*60)
    print(f"\n  🌐 Akses dari perangkat yang sama:")
    print(f"     http://localhost:{port}")
    print(f"     http://127.0.0.1:{port}")
    print(f"\n  📱 Akses dari perangkat lain (jaringan SAMA):")
    print(f"     http://{ip}:{port}")
    print("\n  🌍 Akses dari jaringan BERBEDA (internet):")
    print("     Gunakan salah satu metode berikut:")
    print("     1. ngrok http 8000 (install ngrok)")
    print("     2. ssh -R 80:localhost:8000 serveo.net")
    print("     3. cloudflared tunnel --url http://localhost:8000")
    print("\n  🔴 Tekan CTRL+C untuk menghentikan server")
    print("="*60 + "\n")

def main():
    Path('images').mkdir(exist_ok=True)
    local_ip = get_local_ip()
    show_instructions(local_ip, PORT)
    
    handler = CustomHTTPRequestHandler
    httpd = socketserver.TCPServer(("0.0.0.0", PORT), handler)
    
    # Coba buka di browser
    webbrowser.open(f"http://localhost:{PORT}")
    
    print(f"  ✅ Server berjalan di http://localhost:{PORT}")
    print("  🔄 Menunggu permintaan...\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n  👋 Server dihentikan. Terima kasih!")
        httpd.shutdown()

if __name__ == "__main__":
    main()