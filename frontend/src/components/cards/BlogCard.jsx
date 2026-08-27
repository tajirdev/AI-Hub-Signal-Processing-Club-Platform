import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getImageUrl } from '../../services/api';

const BRAND = {
  navy: "#0a2472",
  navyDark: "#061539",
  amber: "#ffba08",
};

// Generate a stable color based on a string (like category name)
const getColorForString = (str) => {
  if (!str) return { bg: BRAND.amber, text: BRAND.navy };
  const colors = [
    { bg: BRAND.amber, text: BRAND.navy },
    { bg: "#2563eb", text: "#ffffff" }, // blue
    { bg: "#e11d48", text: "#ffffff" }, // rose
    { bg: "#059669", text: "#ffffff" }, // emerald
    { bg: "#7c3aed", text: "#ffffff" }, // purple
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

function ThumbnailArt({ pattern, uid }) {
  const bgId = `blog-bg-${uid}`;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="w-full h-full object-cover">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BRAND.navy} />
          <stop offset="100%" stopColor={BRAND.navyDark} />
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill={`url(#${bgId})`} />

      {pattern === "workshop" && (
        <g fill={BRAND.amber} opacity="0.45">
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 9 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={35 + col * 42} cy={25 + row * 27} r="2.5" />
            ))
          )}
        </g>
      )}

      {pattern === "research" && (
        <g fill={BRAND.amber} opacity="0.55">
          <rect x="50" y="90" width="24" height="50" rx="3" />
          <rect x="90" y="60" width="24" height="80" rx="3" />
          <rect x="130" y="100" width="24" height="40" rx="3" />
          <rect x="170" y="40" width="24" height="100" rx="3" />
          <rect x="210" y="75" width="24" height="65" rx="3" />
        </g>
      )}

      {pattern === "event" && (
        <g>
          <g stroke={BRAND.amber} strokeWidth="2" opacity="0.4" strokeLinecap="round">
            <line x1="200" y1="80" x2="200" y2="40" />
            <line x1="200" y1="80" x2="235" y2="55" />
            <line x1="200" y1="80" x2="165" y2="55" />
            <line x1="200" y1="80" x2="240" y2="90" />
            <line x1="200" y1="80" x2="160" y2="90" />
          </g>
          <circle cx="200" cy="80" r="10" fill={BRAND.amber} opacity="0.6" />
          <g fill={BRAND.amber} opacity="0.4">
            <circle cx="80" cy="40" r="4" />
            <circle cx="320" cy="120" r="4" />
            <circle cx="340" cy="45" r="3" />
            <circle cx="60" cy="120" r="3" />
          </g>
        </g>
      )}
    </svg>
  );
}

export function BlogCard({ post, className }) {
  const categoryName = post.categories?.[0]?.name || "Article";
  const colorTheme = getColorForString(categoryName);
  
  // Determine pattern from category name or randomly fallback
  const pStr = categoryName.toLowerCase();
  const pattern = pStr.includes('workshop') ? 'workshop' : (pStr.includes('event') ? 'event' : 'research');
  
  const dateStr = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }) : 'Recent';

  return (
    <div
      className={cn(
        "relative w-full rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-[#061539] transition-transform duration-300 hover:-translate-y-1 block shrink-0 snap-start h-full flex flex-col",
        "border border-gray-100 dark:border-white/5",
        className
      )}
    >
      {/* Cover image / Graphic */}
      <div className="h-40 w-full overflow-hidden shrink-0 relative bg-navy">
        {post.featured_image ? (
          <img 
            src={getImageUrl(post.featured_image)} 
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <ThumbnailArt pattern={pattern} uid={post.id} />
        )}
      </div>

      {/* Category slug, overlapping the seam */}
      <div
        className="absolute left-5 top-40 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-md z-10"
        style={{ backgroundColor: colorTheme.bg }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorTheme.text }} />
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: colorTheme.text }}>
          {categoryName}
        </span>
      </div>

      {/* Body */}
      <div className="px-6 pt-8 pb-6 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-bold font-heading leading-snug text-navy dark:text-white mb-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm font-medium italic text-navy/70 dark:text-amber mb-3">
            {post.excerpt}
          </p>
        )}
        <p className="text-sm leading-relaxed text-navy/60 dark:text-gray-400  mb-6 flex-grow">
          {post.content?.replace(/<[^>]*>?/gm, '') || ''}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-[#0a2472]/10 dark:bg-white/10">
              <User className="w-3.5 h-3.5 text-navy dark:text-gray-300" />
            </div>
            <span className="text-xs font-semibold text-navy dark:text-gray-300">
              {post.author?.first_name || post.author?.user_name || 'Admin'}
            </span>
          </div>
          <span className="text-xs text-navy/50 dark:text-gray-500 font-medium">
            {dateStr}
          </span>
        </div>
      </div>
    </div>
  );
}
