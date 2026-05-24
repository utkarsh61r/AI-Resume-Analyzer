const pdfParse = require('pdf-parse');
const fs = require('fs');

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info
    };
  } catch (err) {
    throw new Error(`PDF parsing failed: ${err.message}`);
  }
};

const parseResumeText = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  const contactInfo = extractContactInfo(text);
  const experience = extractExperience(text, lines);
  const education = extractEducation(text, lines);
  const projects = extractProjects(text, lines);
  const certifications = extractCertifications(text, lines);
  
  return { contactInfo, experience, education, projects, certifications, rawText: text };
};

const extractContactInfo = (text) => {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+?[\d\s\-().]{10,15})/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  
  // Try to extract name from first few lines
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const nameLine = lines[0] || '';
  
  return {
    name: nameLine.length < 50 && !nameLine.includes('@') ? nameLine : '',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0].trim() : '',
    linkedin: linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : '',
    github: githubMatch ? `github.com/${githubMatch[1]}` : '',
    location: extractLocation(text)
  };
};

const extractLocation = (text) => {
  const locationPatterns = [
    /([A-Z][a-z]+,\s*[A-Z]{2})/,
    /([A-Z][a-z]+\s*,\s*[A-Z][a-z]+)/,
  ];
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return '';
};

const SECTION_HEADERS = {
  experience: /^(work\s*experience|experience|employment|professional\s*experience|work\s*history)/i,
  education: /^(education|academic|qualifications|academic\s*background)/i,
  projects: /^(projects|personal\s*projects|academic\s*projects|key\s*projects)/i,
  certifications: /^(certifications?|certificates?|licenses?|achievements?)/i,
  skills: /^(skills?|technical\s*skills?|core\s*competencies|technologies)/i
};

const extractSectionContent = (lines, sectionRegex) => {
  const sectionStarts = [];
  const allSectionRegexes = Object.values(SECTION_HEADERS);
  
  lines.forEach((line, idx) => {
    if (sectionRegex.test(line)) sectionStarts.push(idx);
  });
  
  if (!sectionStarts.length) return [];
  
  const results = [];
  for (const start of sectionStarts) {
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) {
      if (allSectionRegexes.some(r => r !== sectionRegex && r.test(lines[i]))) {
        end = i;
        break;
      }
    }
    results.push(...lines.slice(start + 1, end));
  }
  return results;
};

const extractExperience = (text, lines) => {
  const expLines = extractSectionContent(lines, SECTION_HEADERS.experience);
  const experiences = [];
  let current = null;
  
  for (const line of expLines) {
    const datePattern = /(\d{4})\s*[-–]\s*(\d{4}|present|current)/i;
    if (datePattern.test(line)) {
      if (current) experiences.push(current);
      current = { company: '', role: '', duration: line.match(datePattern)[0], description: '' };
    } else if (current) {
      if (!current.role && line.length < 80) current.role = line;
      else if (!current.company && line.length < 80) current.company = line;
      else current.description += (current.description ? ' ' : '') + line;
    } else {
      current = { company: line, role: '', duration: '', description: '' };
    }
  }
  if (current) experiences.push(current);
  return experiences.slice(0, 10);
};

const extractEducation = (text, lines) => {
  const eduLines = extractSectionContent(lines, SECTION_HEADERS.education);
  const education = [];
  let current = null;
  
  const degreePatterns = /\b(bachelor|master|ph\.?d|b\.?s|m\.?s|b\.?e|m\.?e|b\.?tech|m\.?tech|mba|diploma|associate)/i;
  
  for (const line of eduLines) {
    if (degreePatterns.test(line)) {
      if (current) education.push(current);
      current = { institution: '', degree: line, year: '' };
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) current.year = yearMatch[0];
    } else if (current) {
      if (!current.institution) current.institution = line;
      else if (!current.year) {
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) current.year = yearMatch[0];
      }
    } else {
      current = { institution: line, degree: '', year: '' };
    }
  }
  if (current) education.push(current);
  return education.slice(0, 5);
};

const extractProjects = (text, lines) => {
  const projLines = extractSectionContent(lines, SECTION_HEADERS.projects);
  const projects = [];
  let current = null;
  
  for (const line of projLines) {
    if (line.length < 60 && !line.startsWith('•') && !line.startsWith('-')) {
      if (current) projects.push(current);
      current = { name: line, description: '', technologies: [] };
    } else if (current) {
      current.description += (current.description ? ' ' : '') + line;
      // Extract tech from line
      const techKeywords = extractTechFromLine(line);
      current.technologies.push(...techKeywords);
    }
  }
  if (current) projects.push(current);
  return projects.slice(0, 8);
};

const extractTechFromLine = (line) => {
  const techWords = ['React', 'Node', 'Python', 'JavaScript', 'TypeScript', 'Java', 'MongoDB', 
    'PostgreSQL', 'MySQL', 'Docker', 'AWS', 'Firebase', 'Redux', 'Express', 'Next.js',
    'Vue', 'Angular', 'Flask', 'Django', 'Spring', 'GraphQL', 'REST', 'API', 'Git'];
  return techWords.filter(t => new RegExp(t, 'i').test(line));
};

const extractCertifications = (text, lines) => {
  const certLines = extractSectionContent(lines, SECTION_HEADERS.certifications);
  return certLines.filter(l => l.length > 5 && l.length < 150).slice(0, 10);
};

module.exports = { extractTextFromPDF, parseResumeText };
