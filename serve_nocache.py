import http.server, socketserver

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()
    def log_message(self, fmt, *args):
        pass  # silence les logs

PORT = 3000
with socketserver.TCPServer(('', PORT), NoCacheHandler) as httpd:
    print(f'Serveur démarré sur http://localhost:{PORT}')
    httpd.serve_forever()
