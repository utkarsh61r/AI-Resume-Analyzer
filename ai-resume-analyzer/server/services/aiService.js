const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const buildPrompt = (resumeData) => {
  const { parsedText, extractedSkills, atsScore, keywordAnalysis, contactInfo } = resumeData;
  
  const skillSummary = [
    extractedSkills?.languages?.slice(0, 5).join(', '),
    extractedSkills?.frameworks?.slice(0, 5).join(', '),
    extractedSkills?.tools?.slice(0, 5).join(', ')
  ].filter(Boolean).join(' | ');
  
  const truncatedText = parsedText?.slice(0, 1500) || 'No text available';
  
  return `You are an expert ATS resume consultant. Analyze this resume and provide specific, actionable feedback.

RESUME SUMMARY:
- Skills Found: ${skillSummary || 'Limited skills detected'}
- ATS Score: ${atsScore?.score || 'N/A'}/100
- Missing Keywords: ${keywordAnalysis?.missing?.slice(0, 8).join(', ') || 'None'}
- Keyword Coverage: ${keywordAnalysis?.coverage || 0}%

RESUME TEXT (excerpt):
${truncatedText}

Respond in this EXACT JSON format (no markdown, no extra text):
{
  "suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    "Specific suggestion 3",
    "Specific suggestion 4",
    "Specific suggestion 5"
  ],
  "priorityFixes": [
    "Critical fix 1",
    "Critical fix 2",
    "Critical fix 3"
  ],
  "optimizedBullets": [
    "• Developed [feature] using [tech], resulting in X% improvement in [metric]",
    "• Led team of N engineers to deliver [project] reducing [pain point] by X%",
    "• Architected [solution] handling X requests/day with 99.9% uptime"
  ]
}`;
};

const getGroqSuggestions = async (resumeData) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');
  
  const response = await axios.post(GROQ_API_URL, {
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: buildPrompt(resumeData) }],
    temperature: 0.7,
    max_tokens: 1000
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });
  
  const content = response.data.choices[0]?.message?.content;
  return JSON.parse(content);
};

const getOpenRouterSuggestions = async (resumeData) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');
  
  const response = await axios.post(OPENROUTER_API_URL, {
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    messages: [{ role: 'user', content: buildPrompt(resumeData) }],
    max_tokens: 1000
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://ai-resume-analyzer.app',
      'X-Title': 'AI Resume Analyzer'
    },
    timeout: 30000
  });
  
  const content = response.data.choices[0]?.message?.content;
  return JSON.parse(content);
};

const getRuleBasedSuggestions = (resumeData) => {
  const { extractedSkills, atsScore, keywordAnalysis, experience, projects } = resumeData;
  
  const suggestions = [];
  const priorityFixes = [];
  
  const score = atsScore?.score || 0;
  const missing = keywordAnalysis?.missing || [];
  const coverage = keywordAnalysis?.coverage || 0;
  
  // ATS score based suggestions
  if (score < 60) {
    priorityFixes.push('Your ATS score is below 60 — critically review all sections for completeness and keywords.');
  }
  if (score < 80) {
    priorityFixes.push('Add more quantified achievements (numbers, percentages, metrics) to strengthen impact.');
  }
  
  // Missing keywords
  if (missing.length > 0) {
    const topMissing = missing.slice(0, 4).join(', ');
    priorityFixes.push(`Add these missing keywords to pass ATS filters: ${topMissing}`);
  }
  
  // Skills
  const totalSkills = (extractedSkills?.languages?.length || 0) + (extractedSkills?.frameworks?.length || 0);
  if (totalSkills < 5) {
    suggestions.push('Add a dedicated "Technical Skills" section listing all programming languages, frameworks, and tools.');
  }
  
  if (!extractedSkills?.tools?.some(t => /docker|kubernetes|aws|cloud/i.test(t))) {
    suggestions.push('Include cloud/DevOps skills (AWS, Docker, Kubernetes) — they are frequently filtered by ATS systems.');
  }
  
  if (coverage < 70) {
    suggestions.push(`Your keyword coverage is ${coverage}%. Review the job description and incorporate matching terminology.`);
  }
  
  // Experience
  suggestions.push('Begin each bullet point with a strong action verb (Developed, Architected, Optimized, Led, Delivered).');
  suggestions.push('Quantify all achievements: replace "improved performance" with "improved API response time by 40%".');
  
  // Format
  suggestions.push('Ensure consistent date formatting (e.g., "Jan 2022 – Present") across all experience entries.');
  suggestions.push('Keep resume to 1-2 pages; remove outdated or irrelevant positions older than 10 years.');
  
  // Profile
  if (coverage < 80) {
    suggestions.push('Add a 2–3 sentence professional summary at the top tailored to your target role.');
  }
  
  const optimizedBullets = [
    '• Developed and deployed microservices architecture using Node.js and Docker, reducing system latency by 35%',
    '• Led cross-functional team of 5 engineers to deliver mobile app 2 weeks ahead of schedule, achieving 4.8★ rating',
    '• Optimized PostgreSQL queries and implemented Redis caching, improving API throughput by 60% under peak load',
    '• Built CI/CD pipeline using GitHub Actions and AWS, cutting deployment time from 2 hours to 15 minutes',
    '• Architected RESTful APIs serving 50K+ daily active users with 99.9% uptime SLA'
  ];
  
  return {
    suggestions: suggestions.slice(0, 6),
    priorityFixes: priorityFixes.slice(0, 3),
    optimizedBullets
  };
};

const getSuggestions = async (resumeData) => {
  // Try Groq first
  try {
    console.log('🤖 Trying Groq API...');
    const result = await getGroqSuggestions(resumeData);
    console.log('✅ Groq API success');
    return { ...result, source: 'groq' };
  } catch (err) {
    console.log(`⚠️  Groq failed: ${err.message}`);
  }
  
  // Fallback to OpenRouter
  try {
    console.log('🤖 Trying OpenRouter API...');
    const result = await getOpenRouterSuggestions(resumeData);
    console.log('✅ OpenRouter success');
    return { ...result, source: 'openrouter' };
  } catch (err) {
    console.log(`⚠️  OpenRouter failed: ${err.message}`);
  }
  
  // Final fallback: rule-based
  console.log('📋 Using rule-based suggestions (no AI API key configured)');
  return { ...getRuleBasedSuggestions(resumeData), source: 'rule-based' };
};

module.exports = { getSuggestions };
