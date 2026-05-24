import { useState } from 'react';
import { analyzeResume, downloadReport, getJobRoles } from '../services/api';
import Navbar from '../components/Navbar';
import UploadZone from '../components/UploadZone';
import ATSScoreCard from '../components/ATSScoreCard';
import SkillsPanel from '../components/SkillsPanel';
import KeywordAnalysis from '../components/KeywordAnalysis';
import SuggestionsPanel from '../components/SuggestionsPanel';
import ResumeDetails from '../components/ResumeDetails';
import AnalysisProgress from '../components/AnalysisProgress';
import { BarChart2, Download, RefreshCw, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const JOB_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer'
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 border border-white/15 text-xs">
      <p className="text-slate-300 font-medium">{label}</p>
      <p className="text-indigo-400 font-semibold">{payload[0].value} pts</p>
    </div>
  );
};

export default function Dashboard() {
  const [resumeId, setResumeId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [results, setResults] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleUploaded = (id, name) => {
    setResumeId(id);
    setFileName(name);
    setResults(null);
    setCurrentStep(id ? 'upload' : null);
  };

  const handleAnalyze = async () => {
    if (!resumeId) { toast.error('Upload a resume first'); return; }
    setAnalyzing(true);
    setResults(null);

    const steps = ['parse', 'skills', 'ats', 'keywords', 'ai'];
    let stepIdx = 0;

    // Simulate step progress while server processes
    const stepInterval = setInterval(() => {
      if (stepIdx < steps.length) {
        setCurrentStep(steps[stepIdx++]);
      } else {
        clearInterval(stepInterval);
      }
    }, 2200);

    try {
      const { data } = await analyzeResume(resumeId, jobRole);
      clearInterval(stepInterval);
      setCurrentStep('ai');
      setResults(data);
      toast.success('Analysis complete!');
    } catch (err) {
      clearInterval(stepInterval);
      toast.error(err.response?.data?.error || 'Analysis failed. Make sure the server is running.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownload = async () => {
    if (!resumeId) return;
    setDownloading(true);
    try {
      const { data } = await downloadReport(resumeId);
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-analysis-${fileName || 'report'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded!');
    } catch {
      toast.error('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const handleReset = () => {
    setResumeId(null);
    setFileName(null);
    setResults(null);
    setCurrentStep(null);
  };

  // Build chart data
  const chartData = results?.atsScore?.breakdown
    ? Object.entries(results.atsScore.breakdown).map(([key, val]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: val,
        max: { skills: 30, experience: 20, projects: 15, education: 10, keywords: 15, format: 10 }[key] || 10
      }))
    : [];

  const barColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16">

        {/* Page header */}
        <div className="py-8">
          <h1 className="font-display font-bold text-3xl text-white mb-1">Resume Analyzer</h1>
          <p className="text-slate-400">Upload your resume PDF and get instant ATS insights</p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {/* Upload */}
            <UploadZone onUploaded={handleUploaded} />

            {/* Job role selector */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Target Job Role
              </label>
              <div className="relative">
                <select
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                  className="w-full appearance-none bg-white/[0.05] border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/60 transition-colors cursor-pointer"
                >
                  {JOB_ROLES.map(r => <option key={r} value={r} className="bg-[#1e1b4b]">{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={!resumeId || analyzing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Analyze Resume</>
              )}
            </button>

            {/* Progress */}
            {(analyzing || currentStep) && (
              <AnalysisProgress currentStep={currentStep} isAnalyzing={analyzing} />
            )}

            {/* Actions after analysis */}
            {results && (
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10 text-sm font-medium transition-all disabled:opacity-50"
                >
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export PDF
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Resume
                </button>
              </div>
            )}

            {/* Resume details */}
            {results && (
              <ResumeDetails
                contactInfo={results.contactInfo}
                experience={results.experience}
                education={results.education}
                projects={results.projects}
                certifications={results.certifications}
              />
            )}
          </div>

          {/* MIDDLE COLUMN */}
          <div className="space-y-5">
            {!results && !analyzing && (
              <div className="glass rounded-2xl p-12 text-center border-2 border-dashed border-white/[0.07]">
                <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Ready to analyze</h3>
                <p className="text-slate-400 text-sm">Upload your resume and click "Analyze Resume" to see your ATS score and insights.</p>
              </div>
            )}

            {analyzing && (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Analyzing your resume...</h3>
                <p className="text-slate-400 text-sm">Parsing PDF, extracting skills, computing ATS score, and generating AI suggestions.</p>
              </div>
            )}

            {results && (
              <>
                {/* ATS Score */}
                <ATSScoreCard atsScore={results.atsScore} />

                {/* Bar chart */}
                {chartData.length > 0 && (
                  <div className="glass rounded-2xl p-6 space-y-4">
                    <h3 className="font-display font-semibold text-white">Score Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={barColors[i % barColors.length]} opacity={0.85} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Keyword analysis */}
                <KeywordAnalysis keywordAnalysis={results.keywordAnalysis} />
              </>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            {results ? (
              <>
                <SkillsPanel extractedSkills={results.extractedSkills} />
                <SuggestionsPanel suggestions={results.suggestions} />
              </>
            ) : (
              <div className="glass rounded-2xl p-8 space-y-5">
                <h3 className="font-display font-semibold text-white">What you'll get</h3>
                {[
                  { icon: '⚡', title: 'Skills Breakdown', desc: 'Languages, frameworks, databases, tools' },
                  { icon: '🎯', title: 'Keyword Gap Analysis', desc: 'Match against job role requirements' },
                  { icon: '🤖', title: 'AI Improvement Tips', desc: 'Groq Llama-3.1 powered suggestions' },
                  { icon: '📝', title: 'Optimized Bullets', desc: 'Better phrasing with metrics' },
                  { icon: '📊', title: 'Priority Fixes', desc: 'Critical issues to address first' },
                  { icon: '📄', title: 'PDF Export', desc: 'Download full analysis report' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
