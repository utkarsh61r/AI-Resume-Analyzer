// Pure rule-based ATS scoring - no external APIs needed

const calculateATSScore = (parsedData, extractedSkills) => {
  const { parsedText, experience, education, projects, certifications, contactInfo } = parsedData;
  const text = parsedText || '';
  
  const skillScore = scoreSkills(extractedSkills);
  const experienceScore = scoreExperience(experience, text);
  const projectScore = scoreProjects(projects, text);
  const educationScore = scoreEducation(education, text);
  const keywordScore = scoreKeywords(text);
  const formatScore = scoreFormat(text, contactInfo);

  const total = Math.round(
    skillScore * 0.30 +
    experienceScore * 0.20 +
    projectScore * 0.15 +
    educationScore * 0.10 +
    keywordScore * 0.15 +
    formatScore * 0.10
  );

  return {
    score: Math.min(100, Math.max(0, total)),
    breakdown: {
      skills: Math.round(skillScore * 0.30),
      experience: Math.round(experienceScore * 0.20),
      projects: Math.round(projectScore * 0.15),
      education: Math.round(educationScore * 0.10),
      keywords: Math.round(keywordScore * 0.15),
      format: Math.round(formatScore * 0.10)
    },
    raw: { skillScore, experienceScore, projectScore, educationScore, keywordScore, formatScore }
  };
};

const scoreSkills = (skills) => {
  const total = (skills.languages?.length || 0) +
    (skills.frameworks?.length || 0) +
    (skills.databases?.length || 0) +
    (skills.tools?.length || 0);
  
  // Score based on breadth and depth
  if (total === 0) return 20;
  if (total < 3) return 40;
  if (total < 6) return 55;
  if (total < 10) return 70;
  if (total < 15) return 82;
  if (total < 20) return 90;
  return 95;
};

const scoreExperience = (experience, text) => {
  if (!experience || experience.length === 0) {
    // Check text for experience keywords even if not parsed
    const expKeywords = ['experience', 'worked', 'developed', 'built', 'led', 'managed', 'implemented'];
    const found = expKeywords.filter(k => text.toLowerCase().includes(k)).length;
    return found > 3 ? 50 : 25;
  }
  
  let score = 30;
  
  // Has experience entries
  score += Math.min(experience.length * 10, 30);
  
  // Check for quantified achievements
  const textToCheck = experience.map(e => e.description).join(' ') + text;
  const quantifiers = textToCheck.match(/\d+%|\d+\+|increased|decreased|reduced|improved|$\d+|\d+x/gi);
  if (quantifiers && quantifiers.length > 0) score += Math.min(quantifiers.length * 5, 25);
  
  // Action verbs
  const actionVerbs = ['developed', 'built', 'led', 'managed', 'created', 'designed', 'implemented',
    'optimized', 'improved', 'reduced', 'increased', 'launched', 'delivered', 'architected'];
  const verbCount = actionVerbs.filter(v => textToCheck.toLowerCase().includes(v)).length;
  score += Math.min(verbCount * 2, 15);
  
  return Math.min(100, score);
};

const scoreProjects = (projects, text) => {
  const hasProjects = (projects && projects.length > 0) || 
    /\bprojects?\b/i.test(text);
  
  if (!hasProjects) return 20;
  
  let score = 40;
  
  if (projects && projects.length > 0) {
    score += Math.min(projects.length * 12, 36);
    
    // Projects with technologies
    const withTech = projects.filter(p => p.technologies && p.technologies.length > 0).length;
    score += withTech * 5;
    
    // Projects with descriptions
    const withDesc = projects.filter(p => p.description && p.description.length > 30).length;
    score += withDesc * 3;
  }
  
  return Math.min(100, score);
};

const scoreEducation = (education, text) => {
  const hasEducation = (education && education.length > 0) ||
    /\b(bachelor|master|phd|degree|university|college|diploma)\b/i.test(text);
  
  if (!hasEducation) return 30;
  
  let score = 50;
  
  if (education && education.length > 0) {
    score += 20;
    
    // Higher degree bonus
    const textToCheck = education.map(e => `${e.degree} ${e.institution}`).join(' ').toLowerCase();
    if (/master|phd|mba|m\.s|m\.tech/.test(textToCheck)) score += 20;
    else if (/bachelor|b\.s|b\.tech|b\.e/.test(textToCheck)) score += 10;
    
    // Institution info completeness
    const complete = education.filter(e => e.institution && e.degree && e.year).length;
    score += complete * 5;
  }
  
  return Math.min(100, score);
};

const scoreKeywords = (text) => {
  const lowerText = text.toLowerCase();
  const impactKeywords = [
    'api', 'rest', 'microservices', 'cloud', 'database', 'backend', 'frontend',
    'full-stack', 'fullstack', 'scalable', 'performance', 'security', 'testing',
    'unit test', 'agile', 'scrum', 'deployment', 'production', 'architecture',
    'algorithm', 'data structure', 'machine learning', 'ai', 'automation'
  ];
  
  const found = impactKeywords.filter(k => lowerText.includes(k)).length;
  
  if (found === 0) return 20;
  const ratio = found / impactKeywords.length;
  return Math.round(20 + ratio * 80);
};

const scoreFormat = (text, contactInfo) => {
  let score = 30;
  
  // Has email
  if (contactInfo?.email) score += 15;
  
  // Has phone
  if (contactInfo?.phone) score += 10;
  
  // Reasonable length (500-3000 words is ideal)
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 200 && wordCount <= 800) score += 20;
  else if (wordCount > 100) score += 10;
  
  // Has multiple sections
  const sections = ['experience', 'education', 'skills', 'projects'].filter(s =>
    new RegExp(s, 'i').test(text)
  ).length;
  score += sections * 5;
  
  // LinkedIn or GitHub
  if (contactInfo?.linkedin || contactInfo?.github) score += 10;
  
  return Math.min(100, score);
};

// Job role keyword datasets
const JOB_ROLE_KEYWORDS = {
  'Software Engineer': [
    'React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'REST API', 'Git', 
    'Docker', 'AWS', 'Testing', 'CI/CD', 'Agile', 'PostgreSQL', 'Python', 'APIs'
  ],
  'Frontend Developer': [
    'React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Redux', 'Next.js', 'Vue.js',
    'Tailwind', 'Responsive Design', 'Web Performance', 'Git', 'Testing', 'Webpack', 'REST API'
  ],
  'Backend Developer': [
    'Node.js', 'Python', 'Java', 'REST API', 'GraphQL', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Redis', 'Docker', 'AWS', 'Microservices', 'CI/CD', 'Authentication', 'Security'
  ],
  'Full Stack Developer': [
    'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'REST API', 'Git', 'Docker', 'AWS',
    'TypeScript', 'Testing', 'CI/CD', 'Agile', 'Redis', 'GraphQL', 'Authentication'
  ],
  'Data Scientist': [
    'Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL',
    'Statistics', 'Data Visualization', 'Scikit-learn', 'Jupyter', 'R', 'Tableau', 'Spark'
  ],
  'DevOps Engineer': [
    'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Jenkins', 'Git',
    'Ansible', 'Monitoring', 'Shell Scripting', 'Python', 'Networking', 'Security', 'Azure'
  ],
  'Mobile Developer': [
    'React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'JavaScript',
    'REST API', 'Git', 'App Store', 'Firebase', 'Push Notifications', 'Testing', 'UX'
  ]
};

const analyzeKeywords = (text, jobRole = 'Software Engineer') => {
  const keywords = JOB_ROLE_KEYWORDS[jobRole] || JOB_ROLE_KEYWORDS['Software Engineer'];
  const lowerText = text.toLowerCase();
  
  const matched = keywords.filter(k => lowerText.includes(k.toLowerCase()));
  const missing = keywords.filter(k => !lowerText.includes(k.toLowerCase()));
  const coverage = Math.round((matched.length / keywords.length) * 100);
  
  return { matched, missing, coverage, jobRole, total: keywords.length };
};

module.exports = { calculateATSScore, analyzeKeywords, JOB_ROLE_KEYWORDS };
