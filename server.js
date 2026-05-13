const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

require('dotenv').config();

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'falconn2kadmin';
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'clips.db');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Sadece video dosyaları kabul edilir'), false);
    }
    cb(null, true);
  },
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(UPLOAD_DIR));

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Veritabanı açılamadı:', err);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      type TEXT NOT NULL,
      uploader TEXT NOT NULL,
      category TEXT DEFAULT 'Genel',
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      videoId INTEGER NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (videoId) REFERENCES videos (id) ON DELETE CASCADE
    )
  `);
});

app.get('/api/videos', (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM videos WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (title LIKE ? OR uploader LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category && category !== 'Tümü') {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY createdAt DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Klipler yüklenemedi' });
    }
    res.json(rows);
  });
});

app.post('/api/videos', (req, res) => {
  const { title, url, type, uploader, category } = req.body;
  if (!title || !url || !type || !uploader) {
    return res.status(400).json({ error: 'Eksik veri gönderildi' });
  }

  const createdAt = Date.now();
  db.run(
    'INSERT INTO videos (title, url, type, uploader, category, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [title, url, type, uploader, category || 'Genel', createdAt],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Klip kaydedilemedi' });
      }
      db.get('SELECT * FROM videos WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Klip okunamadı' });
        }
        res.status(201).json(row);
      });
    }
  );
});

app.post('/api/upload', upload.single('videoFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Video dosyası gerekli' });
  }

  const title = req.body.title || req.file.originalname;
  const uploader = (req.body.uploader || 'Anonim').trim() || 'Anonim';
  const category = req.body.category || 'Genel';
  const url = `/uploads/${req.file.filename}`;
  const type = 'file';
  const createdAt = Date.now();

  db.run(
    'INSERT INTO videos (title, url, type, uploader, category, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [title, url, type, uploader, category, createdAt],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Video bilgisi kaydedilemedi' });
      }
      db.get('SELECT * FROM videos WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Video okunamadı' });
        }
        res.status(201).json(row);
      });
    }
  );
});

app.delete('/api/videos/:id', (req, res) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(403).json({ error: 'Yetki yok' });
  }

  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Geçersiz id' });
  }

  db.run('DELETE FROM videos WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Klip silinemedi' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Klip bulunamadı' });
    }
    res.json({ success: true });
  });
});

app.post('/api/videos/:id/like', (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Geçersiz id' });
  }

  db.run('UPDATE videos SET likes = likes + 1 WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Beğeni eklenemedi' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Klip bulunamadı' });
    }
    res.json({ success: true });
  });
});

app.post('/api/videos/:id/view', (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Geçersiz id' });
  }

  db.run('UPDATE videos SET views = views + 1 WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Görüntülenme eklenemedi' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Klip bulunamadı' });
    }
    res.json({ success: true });
  });
});

app.get('/api/videos/:id/comments', (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Geçersiz id' });
  }

  db.all('SELECT * FROM comments WHERE videoId = ? ORDER BY createdAt DESC', [id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Yorumlar yüklenemedi' });
    }
    res.json(rows);
  });
});

app.post('/api/videos/:id/comments', (req, res) => {
  const id = Number(req.params.id);
  const { author, content } = req.body;

  if (!id || !author || !content) {
    return res.status(400).json({ error: 'Eksik veri gönderildi' });
  }

  const createdAt = Date.now();
  db.run(
    'INSERT INTO comments (videoId, author, content, createdAt) VALUES (?, ?, ?, ?)',
    [id, author, content, createdAt],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Yorum kaydedilemedi' });
      }
      db.get('SELECT * FROM comments WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Yorum okunamadı' });
        }
        res.status(201).json(row);
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Falconn2K backend çalışıyor: http://localhost:${PORT}`);
});
