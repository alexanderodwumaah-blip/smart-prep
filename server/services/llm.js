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
  program, internshipInfo, hasInternship,
}) {
  const history = conversation
    .map(c => `${c.role === 'ai' ? (c.interviewer || 'Interviewer') : name}: ${c.text}`)
    .join('\n');

  // Rich student context — the more the LLM knows, the more tailored the questions
  let studentCtx = `Student: ${name}`;
  if (program) studentCtx += `, studying ${program}`;
  if (fieldLabel) studentCtx += ` (${fieldLabel})`;
  studentCtx += ', from a Ghanaian university.';
  if (hasInternship && internshipInfo) {
    studentCtx += ` Industrial attachment/internship: ${internshipInfo}.`;
  } else if (hasInternship) {
    studentCtx += ' Has done industrial attachment or internship.';
  } else {
    studentCtx += ' Has NOT yet done industrial attachment.';
  }

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

  const alreadyAskedInternship = history.toLowerCase().includes('attachment') || history.toLowerCase().includes('internship');

  const typeGuide = {
    intro: `Warmly open the interview. Ask them to introduce themselves. Sound welcoming and professional.`,
    cv_based: cvData
      ? `Reference ONE specific item from their CV — a named project, listed skill, or work experience. Ask them to walk through it in detail.`
      : (hasInternship && internshipInfo && !alreadyAskedInternship)
        ? `Ask specifically about their industrial attachment: "${internshipInfo.substring(0, 80)}". What did they do, what did they learn, what challenges did they face?`
        : `Ask about their most meaningful academic project or any practical hands-on experience.`,
    technical: `Ask ONE focused, practical ${fieldLabel} (${program || fieldLabel}) technical question for a fresh graduate. Relate it to something they'd actually encounter at a Ghanaian company or institution.`,
    behavioral: `Ask a behavioral question about a real situation — teamwork, conflict, leadership, or overcoming a setback. Use implicit STAR framing.`,
    scenario: `Present a realistic ${fieldLabel} problem scenario — equipment failure, a design trade-off, a site issue — and ask how they'd handle it step by step in a Ghanaian context.`,
    followup: `Ask a sharp, intelligent follow-up to their last answer. Probe for detail, challenge a vague claim, or ask for a concrete example.`,
    closing: `Ask about their motivation for national service, 5-year career goals, or what they hope to contribute to Ghana's ${fieldLabel} sector.`,
  };

  // Special override: if has internship and not asked yet, prioritize it
  let instruction = typeGuide[qType] ?? typeGuide.followup;
  if (qType === 'cv_based' && hasInternship && internshipInfo && !alreadyAskedInternship) {
    instruction = `The student did industrial attachment/internship: "${internshipInfo}". Ask them specifically about this experience — what they did, what they learned, and how it shaped their understanding of the field.`;
  }

  if (interviewer?.focus) {
    const focusBoost = {
      behavioral: ' You are the HR interviewer — focus on people skills, attitude, and soft skills.',
      technical: ` You are the Technical Lead — dig into specific ${program || fieldLabel} technical knowledge.`,
      cv_project: ' You are the Project Manager — focus on projects built, impact made, and lessons learned.',
      scenario: ` You are the Senior Engineer — push with practical ${fieldLabel} scenarios relevant to Ghana.`,
    };
    instruction += focusBoost[interviewer.focus] ?? '';
  }

  const system = `You are ${interviewer?.name ?? 'the interviewer'} ${interviewer?.role ? `(${interviewer.role})` : ''} conducting a mock national service interview. This is question ${currentQ + 1} of ${totalQ}.

${studentCtx}${cvContext}

Your task: ${instruction}

Critical rules:
- Ask EXACTLY one question. One. Not two.
- 1–3 sentences. Sound like a real Ghanaian professional, not a textbook.
- DO NOT repeat any question already in the conversation history.
- DO NOT open with "Great!", "Excellent!", "That's interesting" or hollow praise.
- DO NOT add preamble — go straight to the question.
- Output ONLY the question text.`;

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
async function gradeInterview({ conversation, field: _field, fieldLabel, name, program }) {
  const history = conversation
    .map(c => `${c.role === 'ai' ? 'Interviewer' : name}: ${c.text}`)
    .join('\n');

  const programNote = program ? ` studying ${program}` : '';
  const system = `You are a senior professional interview assessor grading a mock ${fieldLabel} national service interview for ${name}${programNote} (Ghanaian university graduate).

Analyze the FULL transcript carefully. Be honest and specific — this feedback will help the student improve.

Return ONLY valid JSON — no markdown, no code fences, no extra text:
{
  "overall": 0-100,
  "communication": 0-100,
  "technical": 0-100,
  "relevance": 0-100,
  "confidence": 0-100,
  "feedback": "3-5 sentences. Reference SPECIFIC things the student said. Be honest about strengths and weaknesses.",
  "improvements": ["Specific actionable tip 1", "Specific actionable tip 2", "Specific actionable tip 3"]
}

Scoring: Communication 25%, Technical accuracy 35%, Relevance 20%, Confidence/structure 20%.
Baseline: well-prepared student = 60-75. Exceptional answers = 80-90. Never inflate.`;

  const raw = await callLLM([
    { role: 'system', content: system },
    { role: 'user', content: `Full interview transcript:\n${history}` },
  ], 0.3, 500);

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

module.exports = { generateQuestion, gradeInterview, analyseAnswer, answerStudentQuestion };
