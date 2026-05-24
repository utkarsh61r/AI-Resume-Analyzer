import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CheckCircle2, XCircle, Target } from 'lucide-react';

export default function KeywordAnalysis({ keywordAnalysis }) {
  if (!keywordAnalysis) return null;
  const { matched, missing, coverage, jobRole } = keywordAnalysis;

  const coverageColor = coverage >= 80 ? '#10b981' : coverage >= 60 ? '#6366f1' : coverage >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-display font-semibold text-white">Keyword Coverage</h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10">
          <Target className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-300">{jobRole}</span>
        </div>
      </div>

      {/* Coverage ring */}
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="45" cy="45" r="36"
              fill="none"
              stroke={coverageColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - coverage / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${coverageColor}50)` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-xl text-white">{coverage}%</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-white font-medium">Keyword Match Rate</p>
          <p className="text-slate-400 text-xs">{matched?.length || 0} of {(matched?.length || 0) + (missing?.length || 0)} keywords found</p>
          <p className="text-slate-500 text-xs">{missing?.length || 0} keywords missing</p>
        </div>
      </div>

      {/* Matched keywords */}
      {matched?.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Matched</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matched.map((kw, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing keywords */}
      {missing?.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Missing</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((kw, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-300">
                ✗ {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
