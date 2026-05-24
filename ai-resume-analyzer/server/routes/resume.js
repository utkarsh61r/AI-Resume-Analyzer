const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth');
const { extractTextFromPDF, parseResumeText } = require('../services/pdfService');
const { extractSkills } = require('../services/skillService');
const { calculateATSScore, analyzeKeywords, JOB_ROLE_KEYWORDS } = require('../services/atsService');
const { getSuggestions } = require('../services/aiService');
const { generateReport } = require('../services/reportService');

const getResume = () => {
  try { return require('../models/Resume'); } catch { return null; }
};

// In-memory store when DB is not available
const memStore = new Map();

// POST /api/resume/upload
router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const Resume = getResume();
    let resumeId;

    if (Resume) {
      const doc = await Resume.create({
        userId: req.userId || undefined,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size
      });
      resumeId = doc._id.toString();
    } else {
      resumeId = require('uuid').v4();
      memStore.set(resumeId, {
        id: resumeId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        createdAt: new Date()
      });
    }

    res.json({
      success: true,
      resumeId,
      filename: req.file.originalname,
      fileSize: req.file.size,
      message: 'File uploaded successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/resume/parse/:id
router.post('/parse/:id', authMiddleware, async (req, res) => {
  try {
    const Resume = getResume();
    let record;

    if (Resume) {
      record = await Resume.findById(req.params.id);
      if (!record) return res.status(404).json({ error: 'Resume not found' });
    } else {
      record = memStore.get(req.params.id);
      if (!record) return res.status(404).json({ error: 'Resume not found' });
    }

    const filePath = path.join(__dirname, '../uploads', record.filename);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ error: 'File not found on disk' });

    const { text, pages } = await extractTextFromPDF(filePath);
    const parsed = parseResumeText(text);

    if (Resume) {
      await Resume.findByIdAndUpdate(req.params.id, {
        parsedText: text,
        contactInfo: parsed.contactInfo,
        experience: parsed.experience,
        education: parsed.education,
        projects: parsed.projects,
        certifications: parsed.certifications
      });
    } else {
      memStore.set(req.params.id, { ...record, parsedText: text, ...parsed });
    }

    res.json({
      success: true,
      pages,
      contactInfo: parsed.contactInfo,
      experience: parsed.experience,
      education: parsed.education,
      projects: parsed.projects,
      certifications: parsed.certifications,
      textLength: text.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/resume/extract-skills/:id
router.post('/extract-skills/:id', authMiddleware, async (req, res) => {
  try {
    const Resume = getResume();
    let record;

    if (Resume) {
      record = await Resume.findById(req.params.id);
    } else {
      record = memStore.get(req.params.id);
    }
    if (!record) return res.status(404).json({ error: 'Resume not found' });
    if (!record.parsedText) return res.status(400).json({ error: 'Parse resume first' });

    const skills = extractSkills(record.parsedText);

    if (Resume) {
      await Resume.findByIdAndUpdate(req.params.id, { extractedSkills: skills });
    } else {
      memStore.set(req.params.id, { ...record, extractedSkills: skills });
    }

    res.json({ success: true, extractedSkills: skills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/resume/ats/:id
router.post('/ats/:id', authMiddleware, async (req, res) => {
  try {
    const Resume = getResume();
    let record;

    if (Resume) {
      record = await Resume.findById(req.params.id);
    } else {
      record = memStore.get(req.params.id);
    }
    if (!record) return res.status(404).json({ error: 'Resume not found' });

    const atsResult = calculateATSScore(
      { parsedText: record.parsedText, experience: record.experience, education: record.education, projects: record.projects, certifications: record.certifications, contactInfo: record.contactInfo },
      record.extractedSkills || {}
    );

    if (Resume) {
      await Resume.findByIdAndUpdate(req.params.id, { atsScore: atsResult });
    } else {
      memStore.set(req.params.id, { ...record, atsScore: atsResult });
    }

    res.json({ success: true, atsScore: atsResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/resume/keywords/:id
router.post('/keywords/:id', authMiddleware, async (req, res) => {
  try {
    const { jobRole = 'Software Engineer' } = req.body;
    const Resume = getResume();
    let record;

    if (Resume) {
      record = await Resume.findById(req.params.id);
    } else {
      record = memStore.get(req.params.id);
    }
    if (!record) return res.status(404).json({ error: 'Resume not found' });

    const analysis = analyzeKeywords(record.parsedText || '', jobRole);

    if (Resume) {
      await Resume.findByIdAndUpdate(req.params.id, { keywordAnalysis: analysis });
    } else {
      memStore.set(req.params.id, { ...record, keywordAnalysis: analysis });
    }

    res.json({ success: true, keywordAnalysis: analysis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/resume/suggestions/:id
router.post('/suggestions/:id', authMiddleware, async (req, res) => {
  try {
    const Resume = getResume();
    let record;

    if (Resume) {
      record = await Resume.findById(req.params.id);
    } else {
      record = memStore.get(req.params.id);
    }
    if (!record) return res.status(404).json({ error: 'Resume not found' });

    const suggestions = await getSuggestions({
      parsedText: record.parsedText,
      extractedSkills: record.extractedSkills,
      atsScore: record.atsScore,
      keywordAnalysis: record.keywordAnalysis,
      experience: record.experience,
      projects: record.projects
    });

    if (Resume) {
      await Resume.findByIdAndUpdate(req.params.id, { suggestions, analysisComplete: true });
    } else {
      memStore.set(req.params.id, { ...record, suggestions, analysisComplete: true });
    }

    res.json({ success: true, suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/resume/analyze/:id  — runs full pipeline in one shot
router.post('/analyze/:id', authMiddleware, async (req, res) => {
  try {
    const { jobRole = 'Software Engineer' } = req.body;
    const Resume = getResume();
    let record;

    if (Resume) {
      record = await Resume.findById(req.params.id);
    } else {
      record = memStore.get(req.params.id);
    }
    if (!record) return res.status(404).json({ error: 'Resume not found' });

    const filePath = path.join(__dirname, '../uploads', record.filename);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ error: 'File not found on disk' });

    // Step 1: Parse
    const { text } = await extractTextFromPDF(filePath);
    const parsed = parseResumeText(text);

    // Step 2: Skills
    const extractedSkills = extractSkills(text);

    // Step 3: ATS
    const atsScore = calculateATSScore(
      { parsedText: text, ...parsed },
      extractedSkills
    );

    // Step 4: Keywords
    const keywordAnalysis = analyzeKeywords(text, jobRole);

    // Step 5: AI Suggestions
    const suggestions = await getSuggestions({
      parsedText: text,
      extractedSkills,
      atsScore,
      keywordAnalysis,
      experience: parsed.experience,
      projects: parsed.projects
    });

    const fullData = {
      parsedText: text,
      contactInfo: parsed.contactInfo,
      experience: parsed.experience,
      education: parsed.education,
      projects: parsed.projects,
      certifications: parsed.certifications,
      extractedSkills,
      atsScore,
      keywordAnalysis,
      suggestions,
      analysisComplete: true
    };

    if (Resume) {
      await Resume.findByIdAndUpdate(req.params.id, fullData);
      record = await Resume.findById(req.params.id);
    } else {
      const updated = { ...record, ...fullData };
      memStore.set(req.params.id, updated);
      record = updated;
    }

    res.json({ success: true, resumeId: req.params.id, ...fullData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resume/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const Resume = getResume();
    let record;

    if (Resume) {
      record = await Resume.findById(req.params.id).lean();
    } else {
      record = memStore.get(req.params.id);
    }
    if (!record) return res.status(404).json({ error: 'Resume not found' });

    // Don't send full parsedText back in GET (too large)
    const { parsedText, ...rest } = record;
    res.json({ success: true, resume: { ...rest, textLength: parsedText?.length || 0 } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resume/:id/report  — download PDF report
router.get('/:id/report', authMiddleware, async (req, res) => {
  try {
    const Resume = getResume();
    let record;

    if (Resume) {
      record = await Resume.findById(req.params.id).lean();
    } else {
      record = memStore.get(req.params.id);
    }
    if (!record) return res.status(404).json({ error: 'Resume not found' });

    const pdfBuffer = await generateReport(record);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resume-analysis-${req.params.id}.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resume/job-roles — list available job roles
router.get('/meta/job-roles', (req, res) => {
  res.json({ jobRoles: Object.keys(JOB_ROLE_KEYWORDS) });
});

module.exports = router;
