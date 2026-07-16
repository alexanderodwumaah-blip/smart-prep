const API_KEY = process.env.GROQ_API_KEY;
const ENDPOINT = process.env.LLM_ENDPOINT || 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';

async function callLLM(messages, temperature = 0.82) {
  if (!API_KEY) throw new Error('No API key configured');
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens: 320 }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LLM API ${res.status}: ${body.substring(0, 200)}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function generateQuestion({
  conversation, field, fieldLabel, name, cvData,
  interviewer, currentQ, totalQ, questionArc,
}) {
  const history = conversation
    .map(c => `${c.role === 'ai' ? (c.interviewer || 'Interviewer') : name}: ${c.text}`)
    .join('\n');

  let cvContext = '';
  if (cvData) {
    const parts = [];
    if (cvData.skills?.length) parts.push(`Skills: ${cvData.skills.join(', ')}`);
    if (cvData.projects?.length) parts.push(`Projects: ${cvData.projects.join(' | ')}`);
    if (cvData.experience?.length) parts.push(`Experience: ${cvData.experience.join(' | ')}`);
    if (parts.length) cvContext = `\n\nStudent CV Summary:\n${parts.join('\n')}`;
  }

  // Use the arc passed from the client (dynamic/shuffled) or fall back to position-based
  const arc = questionArc || [];
  const qType = arc[currentQ] || (currentQ === 0 ? 'intro' : currentQ === totalQ - 1 ? 'closing' : 'followup');

  const typeGuide = {
    intro: 'Open with "Tell me about yourself." — warm and welcoming tone.',
    cv_based: cvData
      ? `Reference something SPECIFIC from the student's CV — a named project, a listed skill, or a work experience. Ask them to elaborate in detail.`
      : 'Ask about their most significant engineering project or any industrial attachment experience.',
    technical: `Ask ONE focused ${fieldLabel} technical question calibrated for a fresh graduate. Make it practical, not purely textbook.`,
    behavioral: 'Ask a behavioral question using implicit STAR framing — about teamwork, conflict resolution, leadership, or a personal challenge. Make it specific and realistic.',
    scenario: `Present a real-world ${fieldLabel} problem scenario (equipment fault, design decision, site issue) and ask how they would handle it step by step.`,
    followup: 'Ask a sharp, natural follow-up to their last answer — probe for more detail, ask for an example, or explore a gap you noticed.',
    closing: 'Ask about their motivation for national service, career goals, or why a specific company/sector interests them.',
  };

  let instruction = typeGuide[qType] || typeGuide.followup;
  if (interviewer?.focus) {
    const focusBoost = {
      behavioral: ' This is a behavioral-focused interviewer — push for concrete examples.',
      technical: ` This is a technical lead — dig into ${fieldLabel} specifics.`,
      cv_project: ' This interviewer focuses on projects — ask about impact and lessons learned.',
      scenario: ` This is a senior engineer — present a real field scenario for ${fieldLabel}.`,
    };
    instruction += focusBoost[interviewer.focus] || '';
  }

  const system = [
    `You are ${interviewer?.name || 'the interviewer'} ${interviewer?.role ? `(${interviewer.role})` : ''}`,
    `conducting a mock national service interview for ${name}, a ${fieldLabel} graduate from a Ghanaian university.`,
    `This is question ${currentQ + 1} of ${totalQ}.`,
    cvContext,
    `\nYour task: ${instruction}`,
    '\nRules:',
    '- Ask EXACTLY one question.',
    '- Keep it 1–3 sentences, conversational, and natural — not a textbook prompt.',
    '- DO NOT repeat any question already asked in the conversation.',
    '- DO NOT include preamble like "Great answer!" or "Now I\'d like to ask..."',
    '- Output ONLY the question text.',
  ].join(' ');

  return callLLM([
    { role: 'system', content: system },
    { role: 'user', content: `Conversation so far:\n${history || '(none yet)'}\n\nNext question:` },
  ], 0.85);
}

async function gradeInterview({ conversation, field: _field, fieldLabel, name }) {
  const history = conversation
    .map(c => `${c.role === 'ai' ? 'Interviewer' : name}: ${c.text}`)
    .join('\n');

  const system = [
    `You are a professional interview assessor grading a mock ${fieldLabel} national service interview for ${name} (Ghanaian university graduate).`,
    'Analyze the FULL transcript carefully. Return ONLY valid JSON — no markdown, no code fences, no extra text.',
    'JSON format: {"overall":0-100,"communication":0-100,"technical":0-100,"relevance":0-100,"confidence":0-100,',
    '"feedback":"3-5 sentences citing SPECIFIC things the student said — quote briefly","improvements":["specific actionable tip 1","specific actionable tip 2","specific actionable tip 3"]}',
    'Scoring weights: Communication clarity 25%, Technical accuracy 35%, Answer relevance 20%, Confidence & structure 20%.',
    'Be honest and specific — do not give artificially high scores. A score of 50-65 is a reasonable baseline for a prepared student.',
  ].join(' ');

  const raw = await callLLM([
    { role: 'system', content: system },
    { role: 'user', content: `Full interview transcript:\n${history}` },
  ], 0.4); // lower temperature for consistent grading

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

module.exports = { generateQuestion, gradeInterview };
