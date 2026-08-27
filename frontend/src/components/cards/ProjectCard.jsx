import { GitBranch, ExternalLink } from "lucide-react";
import { cn } from '../../utils/cn';
import { Link } from "react-router-dom";
import { getImageUrl } from '../../services/api';

const BRAND = {
  navy: "#0a2472",
  navyDark: "#061539",
  amber: "#ffba08",
};

function ThumbnailArt({ pattern, uid }) {
  const bgId = `thumb-bg-${uid}`;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 176" preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BRAND.navy} />
          <stop offset="100%" stopColor={BRAND.navyDark} />
        </linearGradient>
      </defs>
      <rect width="400" height="176" fill={`url(#${bgId})`} />

      {pattern === "route" && (
        <g>
          <path
            d="M40,140 Q130,50 220,100 T380,55"
            fill="none"
            stroke={BRAND.amber}
            strokeWidth="2"
            strokeDasharray="6 7"
            opacity="0.5"
          />
          <circle cx="40" cy="140" r="5" fill={BRAND.amber} opacity="0.9" />
          <circle cx="220" cy="100" r="5" fill={BRAND.amber} opacity="0.7" />
          <circle cx="380" cy="55" r="6" fill={BRAND.amber} opacity="0.9" />
        </g>
      )}

      {pattern === "terminal" && (
        <g>
          <g opacity="0.5" stroke={BRAND.amber} strokeWidth="3" strokeLinecap="round">
            <line x1="40" y1="55" x2="210" y2="55" />
            <line x1="40" y1="82" x2="280" y2="82" />
            <line x1="40" y1="109" x2="160" y2="109" />
            <line x1="40" y1="136" x2="240" y2="136" />
          </g>
          <rect x="250" y="127" width="14" height="18" fill={BRAND.amber} opacity="0.8" />
        </g>
      )}

      {pattern === "scan" && (
        <g>
          <g stroke={BRAND.amber} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6">
            <path d="M60,50 H92 M60,50 V82" />
            <path d="M340,50 H308 M340,50 V82" />
            <path d="M60,130 H92 M60,130 V98" />
            <path d="M340,130 H308 M340,130 V98" />
          </g>
          <g fill={BRAND.amber} opacity="0.55">
            <circle cx="155" cy="85" r="3" />
            <circle cx="185" cy="65" r="3" />
            <circle cx="215" cy="90" r="3" />
            <circle cx="245" cy="70" r="3" />
            <circle cx="205" cy="105" r="3" />
          </g>
        </g>
      )}
    </svg>
  );
}

const getPattern = (title) => {
  const t = title?.toLowerCase() || '';
  if (t.includes('site') || t.includes('web') || t.includes('app')) return 'terminal';
  if (t.includes('face') || t.includes('scan') || t.includes('detect')) return 'scan';
  return 'route';
};

export function ProjectCard({ project, className }) {
  const stack = project.technology_stack 
    ? project.technology_stack.split(',').map(s => s.trim()).filter(Boolean)
    : (project.stack || []);

  const pattern = getPattern(project.title);

  return (
    <div
      className={cn(
        "relative w-full max-w-[320px] md:max-w-none shrink-0 snap-start rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1 flex flex-col h-full",
        className
      )}
      style={{ backgroundColor: BRAND.navyDark, border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Thumbnail, title tab cut into its bottom-left corner */}
      <div className="relative h-44 w-full overflow-hidden shrink-0">
        {project.thumbnail?.path ? (
          <img 
            src={getImageUrl(project.thumbnail.path)} 
            alt="Thumbnail" 
            className="w-full h-full object-cover absolute inset-0 z-0" 
          />
        ) : (
          <ThumbnailArt pattern={pattern} uid={project.id || 'new'} />
        )}
        <div
          className="absolute bottom-0 left-0 w-[85%] h-14 flex items-end px-5 pb-2.5 z-10"
          style={{
            backgroundColor: BRAND.navyDark,
            clipPath: "polygon(0 0, 90% 0, 100% 100%, 0 100%)",
          }}
        >
          <h3 className="text-white font-bold text-base leading-snug line-clamp-2 pr-6">
            {project.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-grow">
        <p className="text-sm leading-relaxed flex-grow line-clamp-3" style={{ color: "rgba(255,255,255,0.65)" }}>
          {project.description}
        </p>

        <div className="flex items-center gap-3 mt-4">
          {project.repository_url && (
            <a
              href={project.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source code"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <GitBranch className="w-4 h-4" style={{ color: "#ffffff" }} />
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View live demo"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: "rgba(255,186,8,0.15)" }}
            >
              <ExternalLink className="w-4 h-4" style={{ color: BRAND.amber }} />
            </a>
          )}
          
          {/* Always show icons even if links don't exist? Only if requested. Let's hide if missing to be safe, or just render disabled versions. Assuming they just won't render if missing. */}
        </div>

<div className="flex flex-wrap gap-2 mt-4">
          {stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="mt-6">
          <Link
            to={/projects/}
            className="inline-flex items-center text-sm font-semibold transition-colors duration-200 group-hover:underline"
            style={{ color: BRAND.amber }}
          >
            View Project &rarr;
          </Link>
        </div>
      </div>
    </div>
  );

}
