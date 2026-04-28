const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const ffmpeg = require('fluent-ffmpeg');

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
    } else if (file.fieldname === 'video') {
      d = path.join(__dirname, 'uploads/temp_videos');
    }
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    cb(null, d);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

const pool = mariadb.createPool({
  host: '127.0.0.1',
  user: 'username',
  password: 'password',
  database: 'database',
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
  const thumbUrl = files['thumbnail'] ? `/uploads/thumbnails/${files['thumbnail'][0].filename}` : '#';
  const uName = uploaderName || 'SportShield Official';

  if (!files['video']) {
    return res.status(400).json({ success: false, message: 'Video file is required.' });
  }

  const vFilePath = files['video'][0].path;

  // Blockchain Hash validation
  const fileBuffer = fs.readFileSync(vFilePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  const hexHash = hashSum.digest('hex');

  try {
    const existing = await queryDB("SELECT * FROM blockchain_hashes WHERE hash = ?", [hexHash]);
    if (existing.length > 0) {
      fs.unlinkSync(vFilePath);
      return res.status(400).json({ success: false, message: 'Blockchain Validation Failed: This video file is already in use by another website or platform. Duplicates rejected.' });
    }

    const vidIdStr = Date.now().toString();
    const url = `/uploads/videos/${vidIdStr}/index.m3u8`;

    const result = await queryDB(
      "INSERT INTO videos (title, description, category, url, quality, language, is_live, is_premium, tags, rating, thumbnail_url, uploader_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, desc, category, url, quality, language, isL, isP, tags, rating, thumbUrl, uName]
    );
    const dbVidId = Number(result.insertId);

    // Save Hash to Blockchain ledger
    await queryDB("INSERT INTO blockchain_hashes (hash, video_id) VALUES (?, ?)", [hexHash, dbVidId]);

    // HLS DRM Encryption Setup
    const outDir = path.join(__dirname, 'uploads/videos', vidIdStr);
    const keysDir = path.join(__dirname, 'uploads/keys');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });

    const keyPath = path.join(keysDir, `${vidIdStr}.key`);
    const keyInfoPath = path.join(outDir, 'key.info');

    const key = crypto.randomBytes(16);
    fs.writeFileSync(keyPath, key);

    const keyUrl = `/api/videos/keys/${vidIdStr}.key`;
    fs.writeFileSync(keyInfoPath, `${keyUrl}\n${keyPath}`);

    // Process HLS asynchronously
    ffmpeg(vFilePath)
      .outputOptions([
        '-hls_time 10',
        '-hls_list_size 0',
        '-hls_key_info_file ' + keyInfoPath,
        '-hls_segment_filename', path.join(outDir, 'chunk%03d.ts')
      ])
      .output(path.join(outDir, 'index.m3u8'))
      .on('end', () => {
        fs.unlinkSync(vFilePath);
        fs.unlinkSync(keyInfoPath);
      })
      .on('error', (err) => {
        console.error('FFmpeg HLS Error', err);
      })
      .run();

    res.json({ success: true });
  } catch (err) {
    fs.unlinkSync(vFilePath);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/videos/keys/:filename', async (req, res) => {
  const origin = req.get('origin') || req.get('referer') || '';
  const fileId = req.params.filename.replace('.key', '');

  try {
    // Check if this video has been 'taken_down' via DMCA
    const rows = await queryDB(
      "SELECT id FROM piracy_records WHERE status = 'taken_down' AND video_id = (SELECT id FROM videos WHERE url LIKE ? LIMIT 1)",
      [`%${fileId}%`]
    );

    // If under active takedown, restrict access to legitimate origins
    if (rows.length > 0) {
      const isPirate = origin.includes('3001') || origin.toLowerCase().includes('pirate');
      const isLegit = origin.includes('6969') || origin.includes('sportshield') || origin.includes('darkcipher');

      if (isPirate || (!isLegit && origin !== '')) {
        // Provide a dummy AES key dynamically so the Pirate stream crashes!
        console.log(`DRM TAKEDOWN: Denied key access to foreign origin: ${origin} for video ${fileId}`);
        return res.send(crypto.randomBytes(16));
      }
    }
  } catch (err) {
    console.error("DRM Check Error", err);
  }

  const file = path.join(__dirname, 'uploads/keys', req.params.filename);
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.status(404).send('Not found');
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await queryDB("DELETE FROM videos WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
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
  } catch (err) {
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

app.post('/api/piracy/detect', async (req, res) => {
  try {
    // Simulate detecting a pirate stream of our newest content
    const videos = await queryDB("SELECT id, title, url FROM videos ORDER BY created_at DESC LIMIT 1");
    if (videos.length > 0) {
      const v = videos[0];
      const pirateUrl = `https://pirateflix.to/watch?v=${v.id}`;
      await queryDB(
        "INSERT INTO piracy_records (content_name, category, site_name, url, severity, status, video_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [v.title, 'Sports/Movies', 'PirateFlix Premium', pirateUrl, 'High', 'active', v.id]
      );
      res.json({ success: true, message: `Detected piracy for ${v.title}` });
    } else {
      res.status(400).json({ success: false, message: 'No videos available on the platform.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/piracy/:id/status', async (req, res) => {
  const { status, videoId } = req.body;
  try {
    await queryDB("UPDATE piracy_records SET status = ? WHERE id = ?", [status, req.params.id]);

    // DRM Key Rotation on Takedown is handled dynamically in GET /api/videos/keys/:filename
    // so that legitimate users (verified by origin) still get the authentic key while others get a fake one.
    if (status === 'taken_down' && videoId) {
      console.log(`PIRACY: Video ${videoId} marked as taken down. All foreign origins will receive fake decryption keys.`);
    }

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
      ...admins.map(a => ({ ...a, type: 'admin' })),
      ...normal.map(u => ({ ...u, id: Number(u.id) + 1000000, type: 'user' }))
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
