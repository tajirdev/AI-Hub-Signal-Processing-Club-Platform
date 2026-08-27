import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Code, Activity, Globe, Crown, Sparkles, Waves } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getImageUrl } from '../../services/api';

const BRAND = {
  navy: "#0a2472",
  navyDark: "#061539",
  amber: "#ffba08",
};

// SVG background for cover
function CoverArt({ pattern, uid }) {
  const bgId = `cover-bg-${uid}`;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BRAND.navy} />
          <stop offset="100%" stopColor={BRAND.navyDark} />
        </linearGradient>
      </defs>
      <rect width="400" height="150" fill={`url(#${bgId})`} />

      {pattern === "wave" && (
        <g fill="none" stroke={BRAND.amber}>
          <path d="M-10,90 C40,40 90,140 140,90 C190,40 240,140 290,90 C340,40 390,140 410,90" strokeWidth="2" opacity="0.55" />
          <path d="M-10,118 C40,78 90,158 140,118 C190,78 240,158 290,118 C340,78 390,158 410,118" strokeWidth="1.5" opacity="0.3" />
          <path d="M-10,58 C40,18 90,98 140,58 C190,18 240,98 290,58 C340,18 390,98 410,58" stroke="#ffffff" strokeWidth="1" opacity="0.15" />
        </g>
      )}

      {pattern === "circuit" && (
        <g fill="none" stroke={BRAND.amber} strokeWidth="1.5" opacity="0.45">
          <path d="M20,25 H130 V65 H210" />
          <path d="M20,125 H95 V90 H190 V50 H390" />
          <path d="M260,20 V70 H330 V115 H400" />
          <g fill={BRAND.amber} stroke="none" opacity="0.85">
            <circle cx="130" cy="25" r="3" />
            <circle cx="210" cy="65" r="3" />
            <circle cx="190" cy="90" r="3" />
            <circle cx="330" cy="70" r="3" />
            <circle cx="95" cy="125" r="3" />
          </g>
        </g>
      )}

      {pattern === "node" && (
        <g>
          <g stroke={BRAND.amber} strokeWidth="1" opacity="0.35">
            <line x1="40" y1="40" x2="130" y2="85" />
            <line x1="130" y1="85" x2="215" y2="30" />
            <line x1="215" y1="30" x2="300" y2="95" />
            <line x1="300" y1="95" x2="375" y2="50" />
            <line x1="130" y1="85" x2="190" y2="125" />
            <line x1="215" y1="30" x2="270" y2="115" />
          </g>
          <g fill={BRAND.amber}>
            <circle cx="40" cy="40" r="4" opacity="0.7" />
            <circle cx="130" cy="85" r="5" opacity="0.9" />
            <circle cx="215" cy="30" r="4" opacity="0.7" />
            <circle cx="300" cy="95" r="5" opacity="0.9" />
            <circle cx="375" cy="50" r="4" opacity="0.7" />
            <circle cx="190" cy="125" r="3" opacity="0.5" />
            <circle cx="270" cy="115" r="3" opacity="0.5" />
          </g>
        </g>
      )}
    </svg>
  );
}

const getPattern = (name) => {
  const n = name?.toLowerCase() || '';
  if (n.includes('signal') || n.includes('audio')) return 'wave';
  if (n.includes('machine') || n.includes('data')) return 'node';
  return 'circuit';
};

const getIcon = (name) => {
  const n = name?.toLowerCase() || '';
  if (n.includes('ai') || n.includes('intelligence')) return <Sparkles className="w-7 h-7 text-[#ffba08]" />;
  if (n.includes('signal')) return <Waves className="w-7 h-7 text-[#ffba08]" />;
  if (n.includes('web')) return <Globe className="w-7 h-7 text-[#ffba08]" />;
  return <Cpu className="w-7 h-7 text-[#ffba08]" />;
};

export function SubgroupCard({ subgroup, className }) {
  const leaderName = subgroup.leader 
    ? `${subgroup.leader.first_name || ''} ${subgroup.leader.last_name || ''}`.trim() || subgroup.leader.user_name 
    : 'Community';

  const pattern = getPattern(subgroup.name);

  return (
    <div
      className={cn(
        "relative w-[320px] shrink-0 snap-start rounded-[24px] overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1 bg-white dark:bg-[#061539] border border-[#0a2472]/10 dark:border-white/10 flex flex-col",
        className
      )}
    >
      {/* Cover image */}
      <div className="h-28 w-full overflow-hidden relative shrink-0">
        {subgroup.cover_image_url ? (
          <img 
            src={getImageUrl(subgroup.cover_image_url)} 
            alt="Cover" 
            className="w-full h-full object-cover absolute inset-0 z-10" 
          />
        ) : (
          <CoverArt pattern={pattern} uid={subgroup.id || 'new'} />
        )}
      </div>

      {/* Subgroup icon, overlapping the seam, left-aligned */}
      <div className="absolute left-6 top-28 -translate-y-8 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-[#0a2472] border-4 border-white dark:border-[#061539] z-20 overflow-hidden">
        {subgroup.icon_url ? (
          <img 
            src={getImageUrl(subgroup.icon_url)} 
            alt="Icon" 
            className="w-full h-full object-cover" 
          />
        ) : (
          getIcon(subgroup.name)
        )}
      </div>

      {/* Body */}
      <div className="px-6 pt-10 pb-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-[#0a2472] dark:text-white">
          {subgroup.name}
        </h3>

        <div className="mt-2">
          <span className="inline-block rounded-full px-3 py-1 text-xs font-mono backdrop-blur-md bg-[#0a2472]/5 dark:bg-white/10 text-[#0a2472] dark:text-[#ffba08] border border-[#0a2472]/15 dark:border-[#ffba08]/40">
            /{subgroup.slug || 'group'}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#0a2472]/70 dark:text-white/65 line-clamp-3 flex-grow">
          {subgroup.description}
        </p>

        <div className="mt-4 flex items-center gap-2.5 pt-4 border-t border-[#0a2472]/10 dark:border-white/10">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-[#ffba08]/15 text-[#ffba08] overflow-hidden">
            {subgroup.leader?.avatar_url ? (
              <img 
                src={getImageUrl(subgroup.leader.avatar_url)} 
                alt="Leader" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <Crown className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="text-sm font-medium text-[#0a2472] dark:text-white truncate">
            Led by {leaderName}
          </span>
        </div>

        <Link
          to={`/sub-groups/${subgroup.slug}`}
          className="mt-5 w-full rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 text-white"
          style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.amber})` }}
        >
          Join Us
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
