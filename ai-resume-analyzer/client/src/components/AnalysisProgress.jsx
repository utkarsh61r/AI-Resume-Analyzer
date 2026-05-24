import { CheckCircle2, Loader2, Circle } from 'lucide-react';

const STEPS = [
  { key: 'upload', label: 'File Uploaded' },
  { key: 'parse', label: 'Parsing PDF' },
  { key: 'skills', label: 'Extracting Skills' },
  { key: 'ats', label: 'ATS Scoring' },
  { key: 'keywords', label: 'Keyword Analysis' },
  { key: 'ai', label: 'AI Suggestions' },
];

export default function AnalysisProgress({ currentStep, isAnalyzing }) {
  const stepIndex = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Analysis Pipeline</p>
      <div className="space-y-3">
        {STEPS.map((step, i) => {
          const done = i < stepIndex || (!isAnalyzing && stepIndex === STEPS.length - 1);
          const active = i === stepIndex && isAnalyzing;
          const pending = i > stepIndex;

          return (
            <div key={step.key} className={`flex items-center gap-3 transition-all duration-300 ${pending ? 'opacity-40' : ''}`}>
              {done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : active ? (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
              )}
              <span className={`text-sm ${done ? 'text-emerald-300' : active ? 'text-indigo-300 font-medium' : 'text-slate-500'}`}>
                {step.label}
              </span>
              {active && (
                <span className="ml-auto">
                  <span className="inline-flex gap-0.5">
                    {[0, 1, 2].map(d => (
                      <span key={d} className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
