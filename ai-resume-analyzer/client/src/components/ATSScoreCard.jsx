import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

const scoreColor = (s) => {
  if (s >= 80) return '#10b981';
  if (s >= 60) return '#6366f1';
  if (s >= 40) return '#f59e0b';
  return '#ef4444';
};

const scoreLabel = (s) => {
  if (s >= 80) return { text: 'Excellent', cls: 'text-emerald-400' };
  if (s >= 60) return { text: 'Good', cls: 'text-indigo-400' };
  if (s >= 40) return { text: 'Fair', cls: 'text-amber-400' };
  return { text: 'Needs Work', cls: 'text-red-400' };
};

export default function ATSScoreCard({ atsScore }) {
  if (!atsScore) return null;
  const { score, breakdown } = atsScore;
  const color = scoreColor(score);
  const label = scoreLabel(score);

  const breakdownItems = [
    { name: 'Skills', key: 'skills', max: 30, icon: '⚡' },
    { name: 'Experience', key: 'experience', max: 20, icon: '💼' },
    { name: 'Projects', key: 'projects', max: 15, icon: '🚀' },
    { name: 'Education', key: 'education', max: 10, icon: '🎓' },
    { name: 'Keywords', key: 'keywords', max: 15, icon: '🔑' },
    { name: 'Format', key: 'format', max: 10, icon: '📄' },
  ];

  // SVG ring dimensions
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-white">ATS Score</h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
          score >= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
          score >= 60 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
          score >= 40 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
          'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>{label.text}</span>
      </div>

      {/* Ring */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
            <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
            <circle
              cx="90" cy="90" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}60)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-5xl text-white leading-none">{score}</span>
            <span className="text-slate-400 text-sm mt-1">/ 100</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Score Breakdown</p>
        {breakdownItems.map(({ name, key, max, icon }) => {
          const val = breakdown?.[key] || 0;
          const pct = Math.round((val / max) * 100);
          const barColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#6366f1' : pct >= 40 ? '#f59e0b' : '#ef4444';
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span>{icon}</span>{name}
                  <span className="text-slate-600">({max}%)</span>
                </span>
                <span className="font-mono font-medium" style={{ color: barColor }}>{val}/{max}</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, background: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
