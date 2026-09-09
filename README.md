# Simple-NAS-WebServer
Node.js-based NAS web server for uploading, downloading, view, and managing files through a web browser.
Functionally sufficient for saving files to a device from another device, but not designed for security (anyone who has access the URL can delete all files in the uploads folder).


Requirements:

- Node.js 18+
- npm

Installation
--------------------------
|On Windows / Linux|

git clone https://github.com/FirmanMaulanaNA/Simple-NAS-WebServer.git

cd Simple-NAS-WebServer

npm install

node server.js

--------------------------
|On Termux Android |

pkg update

pkg install nodejs git

git clone https://github.com/FirmanMaulanaNA/Simple-NAS-WebServer.git

cd Simple-NAS-WebServer

npm install

node server.js

-how to Access

-Open:

 -local: http://localhost:3000
 or
 -local network: http:<your ip address >:3000
 

-------------------------------------
If you want online you can use: "Cloudflare Tunnel"

Expose your server online without opening router ports by install Cloudflared 

then:
cloudflared tunnel --url http://localhost:3000

Cloudflared will generate a public URL that can be accessed from anywhere.

Storage

Uploaded files are stored in the "uploads" this project directory.
