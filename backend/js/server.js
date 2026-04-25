const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let d = path.join(__dirname, 'uploads/videos');
    if (file.fieldname === 'thumbnail') {
      d = path.join(__dirname, 'uploads/thumbnails');
    }
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    cb(null, d);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'));
  }
});
const upload = multer({ storage });

const pool = mariadb.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'password@123',
  database: 'sportshield',
  connectionLimit: 5
});

// Helper for generic queries
const queryDB = async (sql, params = []) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    if (conn) conn.release();
  }
};

// ----------------------------------------------------
// AUTHENTICATION
// ----------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let rows = await queryDB("SELECT * FROM admins WHERE (username = ? OR email = ?) AND password = ?", [username, username, password]);
    if (rows.length === 0) rows = await queryDB("SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?", [username, username, password]);

    if (rows.length > 0) {
      const user = rows[0];
      const { password: _, ...safeUser } = user;
      res.json({ success: true, user: safeUser });
    } else res.status(401).json({ success: false, message: 'Invalid credentials.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const exists = await queryDB("SELECT id FROM users WHERE username = ? OR email = ?", [username, email]);
    if (exists.length > 0) return res.status(400).json({ success: false, message: 'Username or email already exists.' });

    const result = await queryDB("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')", [username, email, password]);
    res.json({ success: true, user: { id: Number(result.insertId), username, email, role: 'user' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});

// ----------------------------------------------------
// VIDEOS (Dashboard)
// ----------------------------------------------------
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await queryDB("SELECT * FROM videos ORDER BY created_at DESC");
    videos.forEach(v => { 
      v.isLive = !!v.is_live; 
      v.isPremium = !!v.is_premium; 
      v.thumbnail = v.thumbnail_url && v.thumbnail_url !== '#' ? v.thumbnail_url : null;
    });
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/videos', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  const { title, desc, category, quality, language, isLive, isPremium, tags, rating, uploaderName } = req.body;
  const isL = isLive === 'true' ? 1 : 0;
  const isP = isPremium === 'true' ? 1 : 0;
  
  const files = req.files || {};
  const url = files['video'] ? `/uploads/videos/${files['video'][0].filename}` : '#';
  const thumbUrl = files['thumbnail'] ? `/uploads/thumbnails/${files['thumbnail'][0].filename}` : '#';
  const uName = uploaderName || 'SportShield Official';

  try {
    await queryDB(
      "INSERT INTO videos (title, description, category, url, quality, language, is_live, is_premium, tags, rating, thumbnail_url, uploader_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, desc, category, url, quality, language, isL, isP, tags, rating, thumbUrl, uName]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await queryDB("DELETE FROM videos WHERE id = ?", [id]);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/videos/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, quality, isLive, isPremium } = req.body;
    const isL = isLive === 'true' ? 1 : 0;
    const isP = isPremium === 'true' ? 1 : 0;
    
    if (req.file) {
      const thumbUrl = `/uploads/thumbnails/${req.file.filename}`;
      await queryDB(
        "UPDATE videos SET title=?, category=?, quality=?, is_live=?, is_premium=?, thumbnail_url=? WHERE id=?",
        [title, category, quality, isL, isP, thumbUrl, id]
      );
    } else {
      await queryDB(
        "UPDATE videos SET title=?, category=?, quality=?, is_live=?, is_premium=? WHERE id=?",
        [title, category, quality, isL, isP, id]
      );
    }
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// STREAMS 
// ----------------------------------------------------
app.get('/api/streams', async (req, res) => {
  try {
    const streams = await queryDB("SELECT * FROM streams WHERE status = 'live'");
    res.json({ success: true, data: streams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// SECURITY LOGS
// ----------------------------------------------------
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await queryDB("SELECT * FROM security_logs ORDER BY created_at DESC LIMIT 50");
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// PIRACY
// ----------------------------------------------------
app.get('/api/piracy', async (req, res) => {
  try {
    const records = await queryDB("SELECT * FROM piracy_records ORDER BY found_at DESC");
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/piracy/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await queryDB("UPDATE piracy_records SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// USERS & ADMINS
// ----------------------------------------------------
app.get('/api/users', async (req, res) => {
  try {
    const admins = await queryDB("SELECT id, name, username, email, role, status, created_at FROM admins");
    const normal = await queryDB("SELECT id, username as name, username, email, role, status, created_at FROM users");
    
    const combined = [
      ...admins.map(a => ({...a, type: 'admin'})),
      ...normal.map(u => ({...u, id: Number(u.id) + 1000000, type: 'user'}))
    ];

    res.json({ success: true, data: combined });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/admin/users/create', async (req, res) => {
  const { name, username, email, role } = req.body;
  const initPass = 'password123'; 
  try {
    if (role === 'admin' || role === 'director' || role === 'streamer') {
      await queryDB("INSERT INTO admins (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)", [name, username, email, initPass, role]);
    } else {
      await queryDB("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, initPass]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const v = await queryDB("SELECT COUNT(*) as c FROM videos");
    const s = await queryDB("SELECT COUNT(*) as c FROM streams WHERE status='live'");
    const p = await queryDB("SELECT COUNT(*) as c FROM piracy_records WHERE status='active'");
    const admins = await queryDB("SELECT COUNT(*) as c FROM admins");
    const normal = await queryDB("SELECT COUNT(*) as c FROM users");
    const totalUsers = parseInt(admins[0].c) + parseInt(normal[0].c);

    res.json({ success: true, data: { users: totalUsers, streams: s[0].c, videos: v[0].c, piracy: p[0].c } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Auth Server running on port ${PORT}`);
});
