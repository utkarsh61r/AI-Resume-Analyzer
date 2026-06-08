# 🚀 AI Resume Analyzer

An intelligent MERN-based Resume Analysis platform that leverages PDF parsing, NLP, ATS scoring algorithms, and free LLM APIs to help job seekers optimize their resumes for recruiters and Applicant Tracking Systems (ATS).

Built using **React, Node.js, Express, MongoDB, Groq Llama Models, PDF Parsing, and NLP techniques**.

---

## 📌 Overview

AI Resume Analyzer enables users to upload their resumes, extract key information, calculate ATS compatibility scores, identify missing keywords, and receive AI-powered suggestions for improving resume quality.

The system combines rule-based ATS evaluation with Large Language Models (LLMs) to provide actionable feedback without relying on paid APIs.

---

## ✨ Features

### 📄 Resume Upload

* Drag & Drop PDF Upload
* PDF Validation
* Maximum File Size: 5MB
* Upload Progress Tracking
* Resume Preview

### 🔍 Resume Parsing

Extracts:

* Contact Information
* Skills
* Work Experience
* Education
* Projects
* Certifications

Using:

* pdf-parse
* natural
* keyword-extractor
* wink-nlp

### 🧠 Skill Extraction Engine

Automatically identifies:

#### Programming Languages

* JavaScript
* TypeScript
* Python
* Java
* C++

#### Frameworks

* React
* Node.js
* Express.js
* Next.js
* Django

#### Databases

* MongoDB
* MySQL
* PostgreSQL

#### Tools

* Git
* Docker
* AWS
* CI/CD

#### Soft Skills

* Leadership
* Teamwork
* Communication
* Problem Solving

---

## 📊 ATS Scoring System

Implements a custom ATS scoring engine using rule-based evaluation.

### Score Distribution

| Category   | Weight |
| ---------- | ------ |
| Skills     | 30%    |
| Experience | 20%    |
| Projects   | 15%    |
| Education  | 10%    |
| Keywords   | 15%    |
| Formatting | 10%    |

### Example Output

```json
{
  "score": 82,
  "breakdown": {
    "skills": 25,
    "experience": 17,
    "projects": 13,
    "education": 8,
    "keywords": 11,
    "format": 8
  }
}
```

---

## 🎯 Keyword Gap Analysis

Compares extracted resume skills against role-specific datasets.

Example Software Engineer Dataset:

```json
[
  "React",
  "Node.js",
  "MongoDB",
  "REST API",
  "Git",
  "Docker",
  "AWS",
  "Testing",
  "CI/CD"
]
```

Returns:

```json
{
  "matched": ["React", "Node.js"],
  "missing": ["Docker", "AWS"],
  "coverage": 78
}
```

---

## 🤖 AI-Powered Suggestions

Uses:

### Groq API (Default)

Model:

```text
llama-3.1-8b-instant
```

Fallback Providers:

* OpenRouter Free Models
* Hugging Face Inference API
* Ollama (Optional Local Support)

Provides:

* ATS Improvements
* Missing Sections
* Better Project Descriptions
* Strong Action Verbs
* Quantified Achievements
* Missing Technologies
* Resume Optimization Suggestions

Example Response:

```json
{
  "suggestions": [
    "Add quantified achievements"
  ],
  "priorityFixes": [
    "Include cloud deployment projects"
  ],
  "optimizedBullets": [
    "Improved API response time by 40%"
  ]
}
```

---

## 📈 Interactive Dashboard

### Left Panel

* Resume Upload
* Resume Details
* Resume History

### Center Panel

* ATS Score Visualization
* Skill Summary
* Keyword Coverage

### Right Panel

* Missing Skills
* AI Suggestions
* Priority Fixes

### UI Features

* Glassmorphism Design
* Dark Mode
* Responsive Layout
* Recharts Visualization
* Framer Motion Animations

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Recharts
* Framer Motion
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### NLP & Resume Processing

* pdf-parse
* natural
* keyword-extractor
* wink-nlp

### AI Layer

* Groq API
* Llama 3.1 Models

### Authentication

* JWT Authentication
* bcrypt.js

### Reporting

* PDFKit

---

## 📂 Project Structure

```bash
AI-Resume-Analyzer/

client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── App.jsx

server/
├── controllers/
├── routes/
├── middleware/
├── services/
├── models/
├── utils/
├── uploads/
└── server.js
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git

cd ai-resume-analyzer
```

### Install Frontend Dependencies

```bash
cd client

npm install
```

### Install Backend Dependencies

```bash
cd server

npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the server directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key
```

---

## ▶️ Run Locally

### Backend

```bash
cd server

npm run dev
```

### Frontend

```bash
cd client

npm run dev
```

Application:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## 🔗 API Endpoints

### Resume APIs

```http
POST /api/upload
POST /api/parse
POST /api/extract-skills
POST /api/ats
POST /api/keywords
POST /api/suggestions
GET  /api/history
```

### Authentication APIs

```http
POST /api/auth/register
POST /api/auth/login
```

---

## 🗄️ Database Schema

```javascript
Resume {
  filename,
  parsedText,
  extractedSkills,
  atsScore,
  missingKeywords,
  suggestions,
  createdAt
}
```

---

## 📑 Export Features

* Export ATS Report as PDF
* Download Resume Analysis
* Save Reports
* Resume Comparison

---

## 🚀 Deployment

### Frontend

Deploy on:

* Vercel

```bash
npm run build
```

### Backend

Deploy on:

* Render

```bash
npm start
```

### Database

* MongoDB Atlas Free Tier

---

## 🔮 Future Enhancements

* Multi-Resume Comparison
* LinkedIn Profile Analysis
* Cover Letter Generator
* AI Resume Builder
* Interview Question Generator
* Job Matching Engine
* Multi-Language Support

---

## 💼 Resume Project Description

Built an AI Resume Analyzer using the MERN stack, Groq LLM APIs, PDF parsing, and NLP techniques to evaluate ATS scores, extract skills, identify missing keywords, and generate intelligent resume improvement suggestions through an interactive dashboard.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## 📜 License

Licensed under the MIT License.

---

## ⭐ Support

If you found this project useful, please consider giving it a star on GitHub.

Made with ❤️ using MERN, NLP, and Groq AI.
Frontend (React + Vite + Tailwind)
        |
        |
     Axios
        |
        v
Backend (Node + Express)
        |
  -----------------
  |       |       |
MongoDB  Groq   NLP Engine
 Atlas   API    (natural,
                wink-nlp,
                keyword-extractor)
        |
        v
 PDF Parsing
 (pdf-parse)
 AI-Resume-Analyzer/

client/
├── src/
│   ├── components/
│   │   ├── UploadCard.jsx
│   │   ├── ATSChart.jsx
│   │   ├── SkillsSummary.jsx
│   │   ├── SuggestionsPanel.jsx
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── History.jsx
│   │
│   ├── hooks/
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   │
│   ├── utils/
│   └── App.jsx
│
└── package.json


server/
├── controllers/
│   ├── uploadController.js
│   ├── atsController.js
│   ├── skillController.js
│   └── suggestionController.js
│
├── routes/
│   ├── uploadRoutes.js
│   ├── atsRoutes.js
│   ├── skillRoutes.js
│   └── authRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
│
├── services/
│   ├── pdfParser.js
│   ├── groqService.js
│   ├── atsEngine.js
│   ├── skillExtractor.js
│   └── keywordMatcher.js
│
├── models/
│   ├── Resume.js
│   └── User.js
│
├── utils/
├── uploads/
├── server.js
└── package.json


https://github.com/user-attachments/assets/d55484ba-65f5-428d-ab6d-26bbaf745e0b





