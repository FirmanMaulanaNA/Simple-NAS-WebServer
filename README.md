# Simple-NAS-WebServer
Node.js-based NAS web server for uploading, downloading, view, and managing files through a web browser.

Requirements:

- Node.js 18+
- npm

Installation

On Windows / Linux

git clone https://github.com/FirmanMaulanaNA/Simple-NAS-WebServer.git
cd Simple-NAS-WebServer
npm install
node server.js

On Termux Android 

pkg update
pkg install nodejs git

git clone https://github.com/FirmanMaulanaNA/Simple-NAS-WebServer.git
cd Simple-NAS-WebServer
npm install
node server.js

Access

Open:

 local: http://localhost:3000
 local network: http:<your-ip>:3000
 

------------------------
Recommended to use: Cloudflare Tunnel

Expose your server online without opening router ports

cloudflared tunnel --url http://localhost:3000

Cloudflared will generate a public URL that can be accessed from anywhere.

Storage

Uploaded files are stored in the "uploads" directory.
