const PDFDocument = require('pdfkit');

const generateReport = (resume) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const buffers = [];
    
    doc.on('data', d => buffers.push(d));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
    
    const colors = { primary: '#6366f1', dark: '#1e1b4b', gray: '#6b7280', light: '#f8fafc' };
    
    // Header
    doc.rect(0, 0, doc.page.width, 80).fill(colors.dark);
    doc.fillColor('white').fontSize(22).font('Helvetica-Bold')
      .text('AI Resume Analysis Report', 50, 25);
    doc.fontSize(10).font('Helvetica')
      .text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 50, 55);
    
    doc.fillColor(colors.dark).moveDown(2);
    
    // Candidate info
    const contact = resume.contactInfo || {};
    doc.fontSize(16).font('Helvetica-Bold').fillColor(colors.dark).text(contact.name || 'Resume Analysis', 50, 100);
    if (contact.email) doc.fontSize(10).font('Helvetica').fillColor(colors.gray).text(contact.email, 50, 120);
    
    doc.moveDown(1);
    
    // ATS Score box
    const ats = resume.atsScore || {};
    doc.rect(50, 145, 495, 80).fillAndStroke('#f0f4ff', colors.primary);
    doc.fillColor(colors.primary).fontSize(14).font('Helvetica-Bold').text('ATS Score', 70, 158);
    doc.fontSize(36).font('Helvetica-Bold').fillColor(colors.primary)
      .text(`${ats.score || 0}/100`, 380, 150);
    
    // Score interpretation
    const scoreText = ats.score >= 80 ? 'Excellent' : ats.score >= 60 ? 'Good' : ats.score >= 40 ? 'Needs Work' : 'Poor';
    doc.fontSize(11).font('Helvetica').fillColor(colors.gray).text(`Status: ${scoreText}`, 70, 185);
    
    doc.moveDown(3);
    
    // Score Breakdown
    sectionHeader(doc, 'Score Breakdown', colors);
    
    if (ats.breakdown) {
      const breakdown = ats.breakdown;
      const categories = [
        { name: 'Skills (30%)', value: breakdown.skills, max: 30 },
        { name: 'Experience (20%)', value: breakdown.experience, max: 20 },
        { name: 'Projects (15%)', value: breakdown.projects, max: 15 },
        { name: 'Education (10%)', value: breakdown.education, max: 10 },
        { name: 'Keywords (15%)', value: breakdown.keywords, max: 15 },
        { name: 'Format (10%)', value: breakdown.format, max: 10 }
      ];
      
      categories.forEach(cat => {
        const y = doc.y;
        doc.fontSize(10).font('Helvetica').fillColor(colors.dark).text(`${cat.name}`, 60, y);
        const pct = cat.max > 0 ? Math.min((cat.value / cat.max) * 100, 100) : 0;
        doc.rect(200, y + 2, 200, 10).fillAndStroke('#e5e7eb', '#e5e7eb');
        doc.rect(200, y + 2, Math.round(2 * pct), 10).fill(colors.primary);
        doc.fillColor(colors.dark).text(`${cat.value}/${cat.max}`, 410, y);
        doc.moveDown(0.8);
      });
    }
    
    // Keyword Analysis
    doc.moveDown(0.5);
    sectionHeader(doc, 'Keyword Analysis', colors);
    const kw = resume.keywordAnalysis || {};
    doc.fontSize(11).font('Helvetica').fillColor(colors.gray)
      .text(`Coverage: ${kw.coverage || 0}% for ${kw.jobRole || 'Software Engineer'}`, 60);
    
    if (kw.matched && kw.matched.length > 0) {
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#059669').text('Matched Keywords:', 60);
      doc.fontSize(10).font('Helvetica').fillColor(colors.dark)
        .text(kw.matched.join(', '), 60, doc.y, { width: 460 });
    }
    
    doc.moveDown(0.5);
    if (kw.missing && kw.missing.length > 0) {
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#dc2626').text('Missing Keywords:', 60);
      doc.fontSize(10).font('Helvetica').fillColor(colors.dark)
        .text(kw.missing.join(', '), 60, doc.y, { width: 460 });
    }
    
    // Skills
    doc.moveDown(1);
    sectionHeader(doc, 'Extracted Skills', colors);
    const skills = resume.extractedSkills || {};
    
    if (skills.languages?.length) printSkillRow(doc, 'Languages', skills.languages, colors);
    if (skills.frameworks?.length) printSkillRow(doc, 'Frameworks', skills.frameworks, colors);
    if (skills.databases?.length) printSkillRow(doc, 'Databases', skills.databases, colors);
    if (skills.tools?.length) printSkillRow(doc, 'Tools', skills.tools, colors);
    
    // Suggestions
    doc.moveDown(1);
    if (doc.y > 650) doc.addPage();
    sectionHeader(doc, 'AI Recommendations', colors);
    const sugg = resume.suggestions || {};
    
    if (sugg.priorityFixes?.length) {
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#dc2626').text('Priority Fixes:', 60);
      sugg.priorityFixes.forEach((fix, i) => {
        doc.fontSize(10).font('Helvetica').fillColor(colors.dark)
          .text(`${i + 1}. ${fix}`, 70, doc.y, { width: 440 });
        doc.moveDown(0.4);
      });
    }
    
    doc.moveDown(0.5);
    if (sugg.suggestions?.length) {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.primary).text('Recommendations:', 60);
      sugg.suggestions.forEach((s, i) => {
        doc.fontSize(10).font('Helvetica').fillColor(colors.dark)
          .text(`• ${s}`, 70, doc.y, { width: 440 });
        doc.moveDown(0.4);
      });
    }
    
    // Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.rect(0, doc.page.height - 30, doc.page.width, 30).fill(colors.dark);
      doc.fillColor('white').fontSize(8).font('Helvetica')
        .text('AI Resume Analyzer — Powered by MERN + Groq', 50, doc.page.height - 20, { align: 'center', width: doc.page.width - 100 });
    }
    
    doc.end();
  });
};

const sectionHeader = (doc, title, colors) => {
  doc.rect(50, doc.y, 495, 24).fill('#f0f4ff');
  doc.fontSize(12).font('Helvetica-Bold').fillColor(colors.primary)
    .text(title, 60, doc.y - 18);
  doc.moveDown(1);
};

const printSkillRow = (doc, label, items, colors) => {
  if (!items || items.length === 0) return;
  doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.dark).text(`${label}: `, 60, doc.y, { continued: true });
  doc.font('Helvetica').fillColor(colors.gray).text(items.slice(0, 10).join(', '));
  doc.moveDown(0.5);
};

module.exports = { generateReport };
