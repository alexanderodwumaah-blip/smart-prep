const API_KEY = process.env.GROQ_API_KEY;
const ENDPOINT = process.env.LLM_ENDPOINT || 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';

async function callLLM(messages) {
  if (!API_KEY) throw new Error('No API key configured in .env');
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.7, max_tokens: 300 }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LLM API ${res.status}: ${body.substring(0, 200)}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

const QUESTION_ARC = [
  'intro', 'followup', 'cv_based', 'technical',
  'behavioral', 'cv_based', 'technical', 'closing',
];

async function generateQuestion({ conversation, field, fieldLabel, name, cvData, interviewer, currentQ, totalQ }) {
  const history = conversation.map(c =>
    `${c.role === 'ai' ? (c.interviewer || 'Interviewer') : name}: ${c.text}`
  ).join('\n');

  let cvContext = '';
  if (cvData) {
    const parts = [];
    if (cvData.skills && cvData.skills.length)
      parts.push(`Skills: ${cvData.skills.join(', ')}`);
    if (cvData.projects && cvData.projects.length)
      parts.push(`Projects: ${cvData.projects.join(' | ')}`);
    if (cvData.experience && cvData.experience.length)
      parts.push(`Experience: ${cvData.experience.join(' | ')}`);
    if (parts.length) cvContext = '\n\nStudent CV:\n' + parts.join('\n');
  }

  const qType = QUESTION_ARC[currentQ] || 'followup';
  let typeInstruction = '';
  switch (qType) {
    case 'intro':
      typeInstruction = 'Ask "Tell me about yourself."';
      break;
    case 'cv_based':
      typeInstruction = cvData
        ? 'Reference something SPECIFIC from their CV — a project, skill, or experience. Ask them to elaborate.'
        : 'Ask about their most significant project or practical experience.';
      break;
    case 'technical':
      typeInstruction = `Ask a ${fieldLabel} technical question appropriate for a fresh graduate.`;
      break;
    case 'behavioral':
      typeInstruction = 'Ask a behavioral question about teamwork, leadership, or overcoming challenges.';
      break;
    case 'closing':
      typeInstruction = 'Ask about motivation, career goals, or what they hope from national service.';
      break;
    default:
      typeInstruction = 'Ask a natural follow-up based on their last answer.';
  }

  if (interviewer && interviewer.focus) {
    const fm = {
      behavioral: ' Prioritize behavioral questions.',
      technical: ` Prioritize ${fieldLabel} technical questions.`,
      cv_project: ' Prioritize questions about projects and experience.',
      scenario: ` Prioritize practical ${fieldLabel} scenarios.`,
    };
    typeInstruction += (fm[interviewer.focus] || '');
  }

  const messages = [
    {
      role: 'system',
      content: [
        `You are ${interviewer ? interviewer.name : 'the interviewer'}`,
        interviewer ? `(${interviewer.role})` : '',
        `— mock national service interview for ${name}, ${fieldLabel} student from a Ghanaian university.`,
        `Question ${currentQ + 1} of ${totalQ}.`,
        cvContext,
        typeInstruction,
        'Ask exactly ONE question. 1-3 sentences, natural and conversational.',
        'Do NOT repeat a question already asked.',
        'Output ONLY the question text.',
      ].join(' '),
    },
    { role: 'user', content: `Conversation so far:\n${history}\n\nNext question:` },
  ];

  return await callLLM(messages);
}

async function gradeInterview({ conversation, field, fieldLabel, name }) {
  const history = conversation.map(c =>
    `${c.role === 'ai' ? 'Interviewer' : name}: ${c.text}`
  ).join('\n');

  const messages = [
    {
      role: 'system',
      content: `Grade this ${fieldLabel} mock interview for ${name}. Return ONLY valid JSON (no markdown, no fences): {"overall":0-100,"communication":0-100,"technical":0-100,"relevance":0-100,"confidence":0-100,"feedback":"2-4 sentences referencing specific answers","improvements":["imp1","imp2","imp3"]} Weights: Communication 25%, Technical 35%, Relevance 20%, Confidence 20%.`,
    },
    { role: 'user', content: `Transcript:\n${history}` },
  ];

  const raw = await callLLM(messages);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch (e) { return null; }
}

module.exports = { generateQuestion, gradeInterview, QUESTION_ARC };