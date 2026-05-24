import { Link } from 'react-router-dom';
import { Brain, Zap, Target, FileText, BarChart3, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const features = [
  { icon: FileText, title: 'Smart PDF Parsing', desc: 'Extracts skills, experience, education, and contact info from any resume PDF.', color: 'indigo' },
  { icon: BarChart3, title: 'ATS Score Engine', desc: 'Rule-based ATS scoring with detailed breakdowns across 6 weighted categories.', color: 'violet' },
  { icon: Target, title: 'Keyword Coverage', desc: 'Compare your resume against 7 job role datasets to find gaps instantly.', color: 'cyan' },
  { icon: Brain, title: 'AI Suggestions', desc: 'Groq Llama-3.1 generates tailored improvements, optimized bullets, and priority fixes.', color: 'emerald' },
  { icon: Zap, title: 'Skill Extraction', desc: 'NLP-powered detection of 100+ technologies across languages, frameworks, tools, and more.', color: 'amber' },
  { icon: Sparkles, title: 'PDF Reports', desc: 'Download a polished PDF analysis report to share with recruiters or track progress.', color: 'rose' },
];

const stack = ['React + Vite', 'Node.js + Express', 'MongoDB Atlas', 'Groq Llama-3.1', 'pdf-parse', 'Recharts', 'JWT Auth', 'Tailwind CSS'];

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 text-indigo-300 text-sm mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          Free & Open Source — Powered by Groq + Llama 3.1
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-7xl text-white leading-tight mb-6 animate-slide-up">
          AI-Powered{' '}
          <span className="gradient-text">Resume Analyzer</span>
        </h1>

        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
          Upload your resume and get an instant ATS score, skill extraction, keyword coverage analysis, and AI-generated improvement suggestions — completely free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            Analyze My Resume
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/15 text-white font-semibold text-lg hover:bg-white/[0.07] transition-all duration-300"
          >
            View on GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16">
          {[
            { value: '100+', label: 'Skills Detected' },
            { value: '7', label: 'Job Role Datasets' },
            { value: '100%', label: 'Free Forever' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-4 text-center">
              <p className="font-display font-bold text-3xl gradient-text">{stat.value}</p>
              <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-white text-center mb-4">Everything You Need</h2>
          <p className="text-slate-400 text-center mb-12">Built with the best free and open-source tools</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-10 h-10 rounded-xl bg-${color}-500/15 border border-${color}-500/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl text-white mb-8">Built With Free Tech</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {stack.map((tech, i) => (
              <span key={i} className="glass px-4 py-2 rounded-xl text-sm text-slate-300 border border-white/10">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center glass rounded-3xl p-12 border border-indigo-500/20">
          <h2 className="font-display font-bold text-3xl text-white mb-4">Ready to improve your resume?</h2>
          <p className="text-slate-400 mb-8">No account required to start. Upload your PDF and get results in seconds.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300"
          >
            Start Analyzing Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/[0.05] text-center text-slate-500 text-sm">
        <p>Built with MERN + Groq LLM APIs, PDF parsing, and NLP. Open source and free.</p>
      </footer>
    </div>
  );
}
