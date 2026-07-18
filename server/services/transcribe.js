/**
 * Whisper transcription via Groq's audio API.
 * Uses Node 18+ built-in fetch + FormData (no extra deps required).
 * Supported models: whisper-large-v3-turbo (fast), whisper-large-v3 (accurate)
 */
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GROQ_API_KEY;
const WHISPER_MODEL = process.env.WHISPER_MODEL || 'whisper-large-v3-turbo';
const WHISPER_ENDPOINT = 'https://api.groq.com/openai/v1/audio/transcriptions';

/**
 * Transcribe an audio file using Groq's Whisper API.
 * @param {string} filePath - Absolute path to the audio file
 * @param {string} [originalName] - Original filename with extension
 * @returns {Promise<string>} - Transcribed text
 */
async function transcribeAudio(filePath, originalName = 'audio.webm') {
  if (!API_KEY) throw new Error('GROQ_API_KEY not set — cannot transcribe');

  const fileBuffer = fs.readFileSync(filePath);
  const fileSize = fileBuffer.length;

  // Skip transcription if audio is too short (< 0.5KB = almost certainly silence)
  if (fileSize < 500) return '';

  // Groq has a 25MB limit
  if (fileSize > 25 * 1024 * 1024) {
    throw new Error('Audio file too large (max 25MB)');
  }

  // Determine MIME type from extension
  const ext = path.extname(originalName).toLowerCase() || '.webm';
  const mimeType = getMimeType(ext);
  const safeName = 'audio' + ext;

  // Build multipart form using Node 18 built-in FormData + Blob
  const form = new FormData();
  form.append('file', new Blob([fileBuffer], { type: mimeType }), safeName);
  form.append('model', WHISPER_MODEL);
  form.append('language', 'en');
  form.append('response_format', 'json');
  // Prompt primes Whisper for engineering vocabulary & Ghanaian English accents
  form.append('prompt',
    'National service interview. Engineering student. Topics: electrical, mechanical, civil, mining, computer, chemical engineering. Ghana English accent.');

  const response = await fetch(WHISPER_ENDPOINT, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API_KEY}` },
    body: form,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Whisper API ${response.status}: ${body.substring(0, 300)}`);
  }

  const data = await response.json();
  return (data.text || '').trim();
}

function getMimeType(ext) {
  const map = {
    '.webm': 'audio/webm',
    '.ogg': 'audio/ogg',
    '.mp3': 'audio/mpeg',
    '.mp4': 'audio/mp4',
    '.m4a': 'audio/x-m4a',
    '.wav': 'audio/wav',
    '.flac': 'audio/flac',
  };
  return map[ext] || 'audio/webm';
}

module.exports = { transcribeAudio };
