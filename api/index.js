process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT ERROR:', err);
});
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { parseCV } = require('../server/services/cvParser');
const { generateQuestion, gradeInterview } = require('../server/services/llm');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '..', 'client')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// File upload config
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Parse uploaded CV
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

// Generate next interview question
app.post('/api/generate-question', async (req, res) => {
  try {
    const result = await generateQuestion(req.body);
    res.json({ question: result });
  } catch (err) {
    console.error('Question gen error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Grade the full interview
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

// Export for Vercel
module.exports = app;
