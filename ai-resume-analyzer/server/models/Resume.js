const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileSize: { type: Number },
  parsedText: { type: String },
  extractedSkills: {
    technicalSkills: [String],
    frameworks: [String],
    languages: [String],
    databases: [String],
    tools: [String],
    softSkills: [String]
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String,
    linkedin: String,
    github: String,
    location: String
  },
  experience: [{
    company: String,
    role: String,
    duration: String,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    year: String
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String]
  }],
  certifications: [String],
  atsScore: {
    score: Number,
    breakdown: {
      skills: Number,
      experience: Number,
      projects: Number,
      education: Number,
      keywords: Number,
      format: Number
    }
  },
  keywordAnalysis: {
    matched: [String],
    missing: [String],
    coverage: Number,
    jobRole: String
  },
  suggestions: {
    suggestions: [String],
    priorityFixes: [String],
    optimizedBullets: [String]
  },
  analysisComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
