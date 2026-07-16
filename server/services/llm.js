const API_KEY = process.env.GROQ_API_KEY;
const ENDPOINT = process.env.LLM_ENDPOINT || 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';

async function callLLM(messages, temperature = 0.82, maxTokens = 320) {
  if (!API_KEY) throw new Error('No API key configured');
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens: maxTokens }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LLM API ${res.status}: ${body.substring(0, 200)}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// ── 1. GENERATE INTERVIEW QUESTION ──────────────────────────────────────────
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
    if (parts.length) cvContext = `\n\nStudent CV:\n${parts.join('\n')}`;
  }

  const arc = Array.isArray(questionArc) ? questionArc : [];
  const qType = arc[currentQ] ?? (currentQ === 0 ? 'intro' : currentQ >= totalQ - 1 ? 'closing' : 'followup');

  const typeGuide = {
    intro: `Warmly open the interview. Ask the student to introduce themselves. Keep it welcoming and natural — like a real interviewer settling in.`,
    cv_based: cvData
      ? `Reference ONE specific item from their CV (a named project, listed skill, or work experience). Ask them to walk you through it — what they did, what they learned, what challenges they faced.`
      : `Ask about their most meaningful engineering project or any industrial attachment they've done.`,
    technical: `Ask ONE focused, practical ${fieldLabel} technical question pitched at a fresh graduate level. Avoid pure textbook recall — frame it as something they'd actually encounter on the job.`,
    behavioral: `Ask a behavioral question about a real situation — teamwork, handling conflict, leadership, or overcoming failure. Use implicit STAR framing without naming the method.`,
    scenario: `Present a realistic ${fieldLabel} field scenario — a piece of equipment failing, a design trade-off, a site problem — and ask how they'd handle it step by step.`,
    followup: `Ask a sharp, intelligent follow-up to their last answer. Probe for more detail, challenge a vague point, or ask for a concrete example of something they claimed.`,
    closing: `Ask about their motivation for pursuing national service, their career goals, or what they specifically hope to contribute to the industry.`,
  };

  let instruction = typeGuide[qType] ?? typeGuide.followup;
  if (interviewer?.focus) {
    const focusBoost = {
      behavioral: ' You are the HR interviewer — stay focused on people skills, attitude, and soft skills.',
      technical: ` You are the Technical Lead — dig deep into ${fieldLabel} technical knowledge.`,
      cv_project: ' You are the Project Manager — focus on what they built, their impact, and lessons learned.',
      scenario: ` You are the Senior Engineer — push them with practical ${fieldLabel} field scenarios.`,
    };
    instruction += focusBoost[interviewer.focus] ?? '';
  }

  const system = `You are ${interviewer?.name ?? 'the interviewer'} ${interviewer?.role ? `(${interviewer.role})` : ''} conducting a mock national service interview for ${name}, a ${fieldLabel} graduate from a Ghanaian university. This is question ${currentQ + 1} of ${totalQ}.${cvContext}

Your task: ${instruction}

Critical rules:
- Ask EXACTLY one question. One. Not two.
- Keep it 1–3 sentences. Sound like a real human interviewer, not a textbook.
- DO NOT repeat any question already in the conversation history.
- DO NOT start with "Great!", "Excellent!", "That's interesting" or any hollow filler praise.
- DO NOT include preamble — go straight to the question.
- Output ONLY the question text. Nothing else.`;

  return callLLM([
    { role: 'system', content: system },
    { role: 'user', content: `Conversation so far:\n${history || '(none yet)'}\n\nNext question:` },
  ], 0.88);
}

// ── 2. ANALYSE ANSWER IN REAL TIME ──────────────────────────────────────────
// Called after each answer. Returns: { quality, correction, acknowledgement }
// quality: 'strong' | 'partial' | 'weak' | 'irrelevant'
// correction: string (only for technical weak/wrong answers, else null)
// acknowledgement: short human-sounding phrase the interviewer says before next question
async function analyseAnswer({ question, answer, field, fieldLabel, questionType, interviewerName }) {
  const system = `You are ${interviewerName ?? 'an interviewer'} evaluating a ${fieldLabel} student's answer in a mock national service interview.

Assess this answer honestly and return ONLY valid JSON — no markdown, no fences:
{
  "quality": "strong|partial|weak|irrelevant",
  "isWrongTechnically": true|false,
  "correction": "If quality is weak/irrelevant AND it was a technical or scenario question AND the student gave a clearly wrong answer, provide a concise 1-2 sentence correct explanation they can learn from. Otherwise null.",
  "acknowledgement": "A natural 1-sentence human response to what they said — warm but honest. Examples: 'That covers the key points well.', 'You touched on the right idea, though there's a bit more to it.', 'I appreciate your honesty — that's a good starting point.', 'Right, the core principle is there.' Keep it SHORT and VARIED — do not use the same phrase twice in a session."
}

Rules:
- Only provide a correction for technical/scenario questions where the answer is factually wrong or dangerously incomplete.
- Never correct behavioral/motivational answers — there's no single right answer there.
- Be honest. Don't give undeserved praise.
- The acknowledgement must sound like something a real Ghanaian professional would say in an interview, not robotic.`;

  const raw = await callLLM([
    { role: 'system', content: system },
    { role: 'user', content: `Question: ${question}\n\nStudent's answer: ${answer}\n\nQuestion type: ${questionType ?? 'unknown'}` },
  ], 0.5, 280);

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return { quality: 'partial', isWrongTechnically: false, correction: null, acknowledgement: 'Thank you.' };
  try {
    return JSON.parse(match[0]);
  } catch {
    return { quality: 'partial', isWrongTechnically: false, correction: null, acknowledgement: 'I see, thank you.' };
  }
}

// ── 3. ANSWER STUDENT'S QUESTION ────────────────────────────────────────────
// Returns { answer, canAnswer }
// canAnswer: false means the AI couldn't confidently answer — trigger "leave for admin"
async function answerStudentQuestion({ question, field, fieldLabel, interviewerName, conversationSummary }) {
  const system = `You are ${interviewerName ?? 'the interviewer'}, a ${fieldLabel} professional in Ghana. A student just asked you a question at the end of their mock national service interview.

Answer honestly and helpfully. If the question is about ${fieldLabel}, national service placement, Ghanaian engineering industry, career advice, or interview skills — answer it confidently and specifically.

If the question is about something you genuinely cannot answer accurately (very specific company HR policies, exact salary figures, specific legal requirements, topics outside your expertise) — be honest. Say you can't give a reliable answer and suggest they escalate it.

Return ONLY valid JSON:
{
  "canAnswer": true|false,
  "answer": "Your answer if canAnswer is true. 2-4 sentences, warm and helpful. Use specific knowledge about Ghana's engineering sector where relevant. If canAnswer is false, write a short honest explanation of why you can't answer reliably."
}`;

  const raw = await callLLM([
    { role: 'system', content: system },
    { role: 'user', content: `Context: This was a ${fieldLabel} mock interview.\nPrevious conversation summary: ${conversationSummary ?? 'N/A'}\n\nStudent's question: ${question}` },
  ], 0.7, 400);

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return { canAnswer: false, answer: "I'm not sure I can give you a reliable answer on that right now." };
  try {
    return JSON.parse(match[0]);
  } catch {
    return { canAnswer: false, answer: "That's a great question — I'd recommend leaving it for our team to answer properly." };
  }
}

// ── 4. GRADE FULL INTERVIEW ──────────────────────────────────────────────────
async function gradeInterview({ conversation, field: _field, fieldLabel, name }) {
  const history = conversation
    .map(c => `${c.role === 'ai' ? 'Interviewer' : name}: ${c.text}`)
    .join('\n');

  const system = `You are a senior professional interview assessor grading a mock ${fieldLabel} national service interview for ${name}, a Ghanaian university graduate.

Analyze the FULL transcript carefully. Be honest and specific — this feedback will help the student improve.

Return ONLY valid JSON — no markdown, no code fences, no extra text:
{
  "overall": 0-100,
  "communication": 0-100,
  "technical": 0-100,
  "relevance": 0-100,
  "confidence": 0-100,
  "feedback": "3-5 sentences. Reference SPECIFIC things the student said — quote briefly where useful. Be honest about both strengths and weaknesses.",
  "improvements": ["Specific, actionable improvement 1", "Specific, actionable improvement 2", "Specific, actionable improvement 3"]
}

Scoring weights: Communication clarity 25%, Technical accuracy 35%, Answer relevance 20%, Confidence & structure 20%.
Honest baseline: a well-prepared student scores 60-75. Only exceptional answers break 85. Do not inflate scores.`;

  const raw = await callLLM([
    { role: 'system', content: system },
    { role: 'user', content: `Full interview transcript:\n${history}` },
  ], 0.3, 500);

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

module.exports = { generateQuestion, gradeInterview, analyseAnswer, answerStudentQuestion };
