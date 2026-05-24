import { User, Mail, Phone, Link, MapPin, Briefcase, GraduationCap, FolderGit2, Award, ExternalLink } from 'lucide-react';


function InfoRow({ icon: Icon, value, href }) {
  if (!value) return null;
  const content = (
    <div className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
      <Icon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}

function Section({ icon: Icon, title, children, count }) {
  if (!children) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
        <Icon className="w-4 h-4 text-indigo-400" />
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        {count !== undefined && (
          <span className="ml-auto text-xs text-slate-500 font-mono">{count}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ResumeDetails({ contactInfo, experience, education, projects, certifications }) {
  const hasContent = contactInfo || experience?.length || education?.length || projects?.length;
  if (!hasContent) return null;

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <h3 className="font-display font-semibold text-white">Resume Details</h3>

      {/* Contact */}
      {contactInfo && (contactInfo.name || contactInfo.email) && (
        <Section icon={User} title="Contact Information">
          <div className="space-y-2">
            {contactInfo.name && (
              <p className="text-sm font-semibold text-indigo-300">{contactInfo.name}</p>
            )}
            <InfoRow icon={Mail} value={contactInfo.email} href={contactInfo.email ? `mailto:${contactInfo.email}` : null} />
            <InfoRow icon={Phone} value={contactInfo.phone} />
            <InfoRow icon={MapPin} value={contactInfo.location} />
            <InfoRow icon={Link} value={contactInfo.linkedin} href={contactInfo.linkedin ? `https://${contactInfo.linkedin}` : null} />
            <InfoRow icon={ExternalLink} value={contactInfo.github} href={contactInfo.github ? `https://${contactInfo.github}` : null} />
          </div>
        </Section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <Section icon={Briefcase} title="Experience" count={`${experience.length} roles`}>
          <div className="space-y-3">
            {experience.slice(0, 3).map((exp, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1">
                {exp.role && <p className="text-sm font-medium text-white">{exp.role}</p>}
                {exp.company && <p className="text-xs text-indigo-300">{exp.company}</p>}
                {exp.duration && <p className="text-xs text-slate-500 font-mono">{exp.duration}</p>}
              </div>
            ))}
            {experience.length > 3 && (
              <p className="text-xs text-slate-500 text-center">+{experience.length - 3} more roles</p>
            )}
          </div>
        </Section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <Section icon={GraduationCap} title="Education" count={`${education.length} entries`}>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1">
                {edu.degree && <p className="text-sm font-medium text-white">{edu.degree}</p>}
                {edu.institution && <p className="text-xs text-violet-300">{edu.institution}</p>}
                {edu.year && <p className="text-xs text-slate-500 font-mono">{edu.year}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <Section icon={FolderGit2} title="Projects" count={`${projects.length} projects`}>
          <div className="space-y-3">
            {projects.slice(0, 3).map((proj, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1.5">
                <p className="text-sm font-medium text-white">{proj.name}</p>
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.slice(0, 4).map((t, j) => (
                      <span key={j} className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <Section icon={Award} title="Certifications" count={certifications.length}>
          <ul className="space-y-1.5">
            {certifications.map((cert, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-amber-400 mt-0.5">★</span>
                {cert}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
