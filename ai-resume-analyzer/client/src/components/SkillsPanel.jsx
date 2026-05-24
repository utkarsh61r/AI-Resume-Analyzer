import { Code, Layers, Database, Wrench, Heart, Zap } from 'lucide-react';

const CATEGORY_CONFIG = {
  languages: { label: 'Languages', icon: Code, color: 'indigo', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-300' },
  frameworks: { label: 'Frameworks', icon: Layers, color: 'violet', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-300' },
  databases: { label: 'Databases', icon: Database, color: 'cyan', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-300' },
  tools: { label: 'Tools & Cloud', icon: Wrench, color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-300' },
  softSkills: { label: 'Soft Skills', icon: Heart, color: 'rose', bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-300' },
};

function SkillBadge({ skill, config }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-200 hover:scale-105 cursor-default ${config.bg} ${config.border} ${config.text}`}>
      {skill}
    </span>
  );
}

function CategorySection({ category, skills }) {
  const config = CATEGORY_CONFIG[category];
  if (!config || !skills?.length) return null;
  const Icon = config.icon;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-3.5 h-3.5 ${config.text}`} />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{config.label}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded-md ${config.bg} ${config.text} font-mono`}>{skills.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, i) => (
          <SkillBadge key={i} skill={skill} config={config} />
        ))}
      </div>
    </div>
  );
}

export default function SkillsPanel({ extractedSkills }) {
  if (!extractedSkills) return null;

  const totalSkills = Object.values(extractedSkills).reduce((acc, arr) => acc + (arr?.length || 0), 0);

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-white">Extracted Skills</h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-300">{totalSkills} found</span>
        </div>
      </div>

      <div className="space-y-4">
        {Object.keys(CATEGORY_CONFIG).map(cat => (
          <CategorySection key={cat} category={cat} skills={extractedSkills[cat]} />
        ))}
      </div>

      {totalSkills === 0 && (
        <p className="text-slate-500 text-sm text-center py-4">No skills detected. Try analyzing your resume first.</p>
      )}
    </div>
  );
}
