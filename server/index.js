// DEBUG: Force all errors to show in Render logs
process.on('uncaughtException', (err) => {
  console.error('=== UNCAUGHT ERROR ===');
  console.error(err);
  console.error('=== END ERROR ===');
});
process.on('unhandledRejection', (reason) => {
  console.error('=== UNHANDLED REJECTION ===');
  console.error(reason);
  console.error('=== END REJECTION ===');
});

require('dotenv').config();

// Try loading everything and catch the exact error
try {
  const express = require('express');
  const multer = require('multer');
  const cors = require('cors');
  const path = require('path');
  const fs = require('fs');

  // Test problematic modules one by one
  console.log('Loading cvParser...');
  const { parseCV } = require('./services/cvParser');
  console.log('cvParser loaded OK');

  console.log('Loading llm...');
  const { generateQuestion, gradeInterview } = require('./services/llm');
  console.log('llm loaded OK');

  const app = express();
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      /\.vercel\.app$/,
      /\.onrender\.com$/
    ],
    credentials: true
  }));
  app.use(express.json({ limit: '1mb' }));

  // Use /tmp on Render (ephemeral, writable), fall back to local uploads
  const uploadDir = process.env.RENDER ? '/tmp/uploads' : path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const upload = multer({
    dest: uploadDir,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const ok = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      cb(null, ok.includes(file.mimetype));
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/parse-cv', upload.single('cv'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      const field = req.body.field || 'electrical';
      const result = await parseCV(req.file.path, req.file.mimetype, field);
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      res.json(result);
    } catch (err) {
      console.error('CV parse error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/generate-question', async (req, res) => {
    try {
      const result = await generateQuestion(req.body);
      res.json({ question: result });
    } catch (err) {
      console.error('Question gen error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/grade', async (req, res) => {
    try {
      const grading = await gradeInterview(req.body);
      if (!grading) return res.status(500).json({ error: 'Failed to parse grading' });
      res.json(grading);
    } catch (err) {
      console.error('Grading error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n  NS Interview Prep — Server running`);
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  Health:  http://localhost:${PORT}/api/health\n`);
  });

} catch (err) {
  console.error('=== FATAL STARTUP ERROR ===');
  console.error(err.stack || err);
  console.error('=== END FATAL ERROR ===');
  process.exit(1);
}