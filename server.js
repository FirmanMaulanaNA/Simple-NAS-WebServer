
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        // Sanitize filename
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, safeName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5GB
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

// API Routes

// GET /api/files - List all files
app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(UPLOAD_DIR).map(filename => {
            const stats = fs.statSync(path.join(UPLOAD_DIR, filename));
            const ext = path.extname(filename).substring(1).toLowerCase();
            return {
                name: filename,
                size: stats.size,
                mtime: stats.mtime,
                ext: ext,
                type: getFileType(ext)
            };
        });
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read files', details: err.message });
    }
});

// POST /api/upload - Upload files
app.post('/api/upload', upload.array('files', 50), (req, res) => {
    try {
        const uploadedFiles = req.files.map(f => ({
            name: f.filename,
            size: f.size,
            mtime: f.mtime ? new Date(f.mtime) : new Date(),
            ext: path.extname(f.originalname).substring(1).toLowerCase()
        }));
        res.json(uploadedFiles);
    } catch (err) {
        res.status(500).json({ error: 'Upload failed', details: err.message });
    }
});

// DELETE /api/files/:name - Delete a file
app.delete('/api/files/:name', (req, res) => {
    try {
        const filename = decodeURIComponent(req.params.name);
        // Path traversal prevention
        const filePath = path.resolve(path.join(UPLOAD_DIR, filename));
        if (!filePath.startsWith(UPLOAD_DIR)) {
            return res.status(400).json({ error: 'Invalid filename' });
        }
        
        fs.unlinkSync(filePath);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed', details: err.message });
    }
});

// PUT /api/files/:name - Rename a file
app.put('/api/files/:name', (req, res) => {
    try {
        const oldName = decodeURIComponent(req.params.name);
        const { newName } = req.body;
        
        if (!newName || newName.trim() === '') {
            return res.status(400).json({ error: 'New name required' });
        }
        
        const oldPath = path.resolve(path.join(UPLOAD_DIR, oldName));
        const newPath = path.resolve(path.join(UPLOAD_DIR, newName));
        
        if (!oldPath.startsWith(UPLOAD_DIR) || !newPath.startsWith(UPLOAD_DIR)) {
            return res.status(400).json({ error: 'Invalid path' });
        }
        
        fs.renameSync(oldPath, newPath);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Rename failed', details: err.message });
    }
});

// GET /api/storage - Get storage info
app.get('/api/storage', (req, res) => {
    try {
        const stats = fs.statfsSync(UPLOAD_DIR);
        const total = stats.bsize * stats.blocks;
        const free = stats.bsize * stats.bfree;
        const used = total - free;
        
        res.json({
            total,
            used,
            free
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get storage info', details: err.message });
    }
});

// GET /uploads/:filename - Serve files
app.get('/uploads/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.resolve(path.join(UPLOAD_DIR, filename));
    
    if (!filePath.startsWith(UPLOAD_DIR)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    res.sendFile(filePath);
});

function getFileType(ext) {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
    
    if (imageExts.includes(ext)) return 'image';
    if (videoExts.includes(ext)) return 'video';
    return 'file';
}

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 NAS Server running at http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${UPLOAD_DIR}`);
    console.log(`\n✅ Server is ready to accept connections.`);
});
