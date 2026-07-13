// Go Local Siouxland — minimal zero-dependency static file server.
// Designed for Railway (Nixpacks auto-detects Node via package.json).
// Binds to 0.0.0.0 on the port Railway provides via process.env.PORT.
// Also 301-redirects the www subdomain to the canonical apex domain.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const CANONICAL_HOST = 'golocalsiouxland.com'; // apex is canonical

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  try {
    // Canonical redirect: www.golocalsiouxland.com -> https://golocalsiouxland.com
    const host = (req.headers.host || '').toLowerCase().split(':')[0];
    if (host.startsWith('www.')) {
      res.writeHead(301, { Location: 'https://' + CANONICAL_HOST + req.url });
      return res.end();
    }

    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';

    let filePath = path.normalize(path.join(ROOT, urlPath));
    // Block path traversal outside the project root.
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        // Fallback to index.html (this site uses in-page hash routing).
        filePath = path.join(ROOT, 'index.html');
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
      });
      fs.createReadStream(filePath).pipe(res);
    });
  } catch (e) {
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Go Local Siouxland is running on port ' + PORT);
});
