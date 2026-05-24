# 🤖 AI Resume Analyzer

> Built with MERN + Groq LLM APIs, PDF parsing, and NLP techniques to evaluate ATS scores, extract skills, identify missing keywords, and generate resume improvement suggestions.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-6366f1?style=flat-square) ![AI](https://img.shields.io/badge/AI-Groq_Llama_3.1-8b5cf6?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-10b981?style=flat-square)

---

## ✨ Features

| Feature | Details |
|---|---|
| 📄 **PDF Parsing** | `pdf-parse` extracts text, contact info, experience, education, projects, certifications |
| ⚡ **Skill Extraction** | NLP keyword matching across 100+ technologies in 5 categories |
| 📊 **ATS Scoring** | Rule-based engine with 6 weighted categories (Skills 30%, Experience 20%, etc.) |
| 🎯 **Keyword Analysis** | Compare against 7 job-role datasets, get matched/missing keywords |
| 🤖 **AI Suggestions** | Groq Llama-3.1 → OpenRouter → Rule-based fallback chain |
| 📑 **PDF Reports** | Download polished analysis reports with `pdfkit` |
| 🔐 **JWT Auth** | Optional auth; works without an account too |
| 📜 **Resume History** | Save and revisit past analyses (requires MongoDB) |

---

## 🛠 Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS (glassmorphism dark theme)
- React Router v6
- Recharts (ATS bar chart, coverage ring)
- Axios + react-hot-toast + lucide-react

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose (optional — in-memory fallback included)
- `pdf-parse` for PDF text extraction
- `natural` for NLP processing
- `pdfkit` for report generation
- JWT + bcryptjs for authentication

**AI Layer (Free Tier Priority)**
1. 🥇 **Groq API** (`llama-3.1-8b-instant`) — [free tier](https://console.groq.com)
2. 🥈 **OpenRouter** (`meta-llama/llama-3.1-8b-instruct:free`) — [free tier](https://openrouter.ai)
3. 🥉 **Rule-based** — Always works, no API key needed

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer
npm run install:all
```

### 2. Configure Environment

**Server** (`server/.env`):
```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Optional — app works without DB (history disabled)
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/resume-analyzer

# JWT secret
JWT_SECRET=your-random-secret-key

# AI API Keys (at least one recommended; rule-based fallback works without)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxx
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App opens on http://localhost:5173
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload PDF file |
| POST | `/api/resume/analyze/:id` | Run full analysis pipeline |
| POST | `/api/resume/parse/:id` | Extract text from PDF |
| POST | `/api/resume/extract-skills/:id` | NLP skill extraction |
| POST | `/api/resume/ats/:id` | Calculate ATS score |
| POST | `/api/resume/keywords/:id` | Keyword gap analysis |
| POST | `/api/resume/suggestions/:id` | AI improvement suggestions |
| GET | `/api/resume/:id` | Get resume data |
| GET | `/api/resume/:id/report` | Download PDF report |
| GET | `/api/history` | User's resume history (auth required) |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── UploadZone.jsx       # Drag & drop with progress
│       │   ├── ATSScoreCard.jsx     # Animated ring + breakdown
│       │   ├── SkillsPanel.jsx      # Categorized skill badges
│       │   ├── KeywordAnalysis.jsx  # Coverage ring + matched/missing
│       │   ├── SuggestionsPanel.jsx # AI suggestions + priority fixes
│       │   ├── ResumeDetails.jsx    # Contact/experience/education
│       │   └── AnalysisProgress.jsx # Step-by-step pipeline progress
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── Dashboard.jsx        # Main 3-column analysis UI
│       │   ├── AuthPage.jsx
│       │   └── HistoryPage.jsx
│       ├── context/AuthContext.jsx
│       └── services/api.js
│
└── server/                    # Node.js + Express backend
    ├── models/
    │   ├── Resume.js
    │   └── User.js
    ├── routes/
    │   ├── resume.js           # All resume endpoints
    │   ├── auth.js
    │   └── history.js
    ├── services/
    │   ├── pdfService.js       # pdf-parse + section extraction
    │   ├── skillService.js     # NLP keyword matching
    │   ├── atsService.js       # Rule-based ATS engine + job datasets
    │   ├── aiService.js        # Groq → OpenRouter → rule-based
    │   └── reportService.js    # pdfkit report generation
    └── middleware/
        ├── auth.js             # JWT middleware
        └── upload.js           # Multer PDF upload
```

---

## 🎯 ATS Scoring Weights

```
Skills      30% — languages, frameworks, tools breadth
Experience  20% — roles, quantified achievements, action verbs
Projects    15% — count, descriptions, technologies
Education   10% — degree level, completeness
Keywords    15% — match rate against job role dataset
Format      10% — contact info, LinkedIn, structure
```

---

## 🌐 Deployment

### Render (Backend — Free Tier)
1. Push to GitHub
2. Create new Web Service on Render → connect repo
3. Root directory: `server`, Build command: `npm install`, Start: `node index.js`
4. Add environment variables in Render dashboard

### Vercel (Frontend — Free Tier)
1. Import repo on Vercel
2. Set root to `client`, framework preset: Vite
3. Add env variable: `VITE_API_URL=https://your-render-app.onrender.com/api`

### MongoDB Atlas (Database — Free Tier)
1. Create free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` for Render
3. Copy connection string to `MONGODB_URI`

---

## 🔑 Getting Free API Keys

| Service | Link | Free Tier |
|---------|------|-----------|
| Groq (Llama 3.1) | [console.groq.com](https://console.groq.com/keys) | 14,400 req/day |
| OpenRouter | [openrouter.ai/keys](https://openrouter.ai/keys) | Free models available |
| MongoDB Atlas | [mongodb.com/atlas](https://mongodb.com/atlas) | 512MB free |

---

## 📄 License

MIT — free to use, modify, and distribute.
