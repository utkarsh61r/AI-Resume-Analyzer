import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHistory, deleteResume, downloadReport } from '../services/api';
import Navbar from '../components/Navbar';
import { History, Trash2, Download, BarChart3, FileText, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const scoreColor = (s) => {
  if (s >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
  if (s >= 60) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25';
  if (s >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
  return 'text-red-400 bg-red-500/10 border-red-500/25';
};

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data } = await getHistory();
      setResumes(data.resumes || []);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteResume(id);
      setResumes(prev => prev.filter(r => r._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const { data } = await downloadReport(id);
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis-${name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Download failed');
    }
  };

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <History className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Analysis History</h1>
            <p className="text-slate-400 text-sm">Your saved resume analyses</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No analyses yet</h3>
            <p className="text-slate-400 text-sm mb-6">Upload and analyze a resume to see it here.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
            >
              Go to Analyzer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map(resume => (
              <div key={resume._id} className="glass rounded-2xl p-5 hover:border-indigo-500/25 transition-all duration-200">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <p className="font-medium text-white truncate">{resume.originalName}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{new Date(resume.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {resume.keywordAnalysis?.jobRole && (
                        <span className="px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/10">
                          {resume.keywordAnalysis.jobRole}
                        </span>
                      )}
                      {resume.extractedSkills && (
                        <span>
                          {(resume.extractedSkills.languages?.length || 0) + (resume.extractedSkills.frameworks?.length || 0)} skills
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {resume.atsScore?.score !== undefined && (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold ${scoreColor(resume.atsScore.score)}`}>
                        <BarChart3 className="w-3.5 h-3.5" />
                        {resume.atsScore.score}/100
                      </div>
                    )}

                    <button
                      onClick={() => handleDownload(resume._id, resume.originalName)}
                      className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                      title="Download report"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(resume._id)}
                      disabled={deleting === resume._id}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === resume._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
