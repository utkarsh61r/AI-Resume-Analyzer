import { AlertTriangle, Lightbulb, Sparkles, ChevronRight } from 'lucide-react';

export default function SuggestionsPanel({ suggestions }) {
  if (!suggestions) return null;
  const { suggestions: sugg = [], priorityFixes = [], optimizedBullets = [], source } = suggestions;

  return (
    <div className="space-y-4">
      {/* Priority fixes */}
      {priorityFixes.length > 0 && (
        <div className="glass rounded-2xl p-6 space-y-4 border border-red-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/25 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h3 className="font-display font-semibold text-white">Priority Fixes</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{priorityFixes.length}</span>
          </div>
          <ul className="space-y-3">
            {priorityFixes.map((fix, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-xs text-red-400 font-bold mt-0.5">{i + 1}</span>
                <span className="text-slate-300 leading-relaxed">{fix}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Suggestions */}
      {sugg.length > 0 && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-display font-semibold text-white">Recommendations</h3>
            {source && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400 border border-white/10 ml-auto">
                via {source === 'groq' ? '🤖 Groq AI' : source === 'openrouter' ? '🤖 OpenRouter' : '📋 Rules'}
              </span>
            )}
          </div>
          <ul className="space-y-3">
            {sugg.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm group">
                <ChevronRight className="flex-shrink-0 w-4 h-4 text-indigo-400 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                <span className="text-slate-300 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Optimized bullet examples */}
      {optimizedBullets.length > 0 && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="font-display font-semibold text-white">Optimized Bullet Examples</h3>
          </div>
          <ul className="space-y-3">
            {optimizedBullets.map((b, i) => (
              <li key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-slate-300 font-mono leading-relaxed hover:border-violet-500/25 transition-colors">
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
