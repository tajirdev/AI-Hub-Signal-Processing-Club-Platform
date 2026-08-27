import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Rss, Calendar, User, Info, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

const BRAND = {
  navy: "#0a2472",
  amber: "#ffba08",
};

// Map news types to icons
const getIconForType = (type) => {
  const t = type?.toLowerCase() || '';
  if (t.includes('announce')) return Megaphone;
  if (t.includes('update')) return Rss;
  if (t.includes('recap') || t.includes('event')) return Calendar;
  return FileText;
};

// Generate a stable color based on a string (like category name or news type)
const getColorForString = (str) => {
  if (!str) return { bg: BRAND.amber, text: BRAND.navy };
  const colors = [
    { bg: BRAND.amber, text: BRAND.navy },
    { bg: "#7c3aed", text: "#ffffff" }, // purple
    { bg: "#e11d48", text: "#ffffff" }, // rose
    { bg: "#0284c7", text: "#ffffff" }, // sky
    { bg: "#059669", text: "#ffffff" }, // emerald
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export function NewsCard({ news, className }) {
  const TypeIcon = getIconForType(news.news_type);
  const colorTheme = getColorForString(news.category?.name || news.news_type);
  const categoryName = news.category?.name || 'General';

  return (
    <Link 
      to={`/news/${news.id}`}
      className={cn(
        "relative transition-transform duration-300 hover:-translate-y-1 block w-full shrink-0 snap-start",
        className
      )}
    >
      {/* Layered card peeking out behind, category color */}
      <div
        className="absolute inset-0 rounded-3xl translate-x-2 translate-y-1 shadow-sm opacity-80 dark:opacity-40 transition-transform duration-300 group-hover:translate-x-3"
        style={{ backgroundColor: colorTheme.bg }}
      />

      {/* Main card */}
      <div className="relative rounded-3xl bg-white dark:bg-[#061539] shadow-xl overflow-hidden h-full flex flex-col border border-gray-100 dark:border-white/5">
        {/* Color strip down the right edge */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2.5"
          style={{ backgroundColor: colorTheme.bg }}
        />

        <div className="pl-6 pr-8 py-6 flex flex-col h-full">
          {/* News type */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#0a2472]/10 dark:bg-white/10">
              <TypeIcon className="w-5 h-5 text-navy dark:text-amber" />
            </div>
            <span className="text-sm uppercase tracking-wider font-bold text-navy/60 dark:text-gray-400">
              {news.news_type || 'Update'}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-black font-heading leading-snug text-navy dark:text-white mb-2">
            {news.title}
          </h3>

          {/* Slug */}
          <div className="mb-4">
            <span className="inline-block rounded-full px-3 py-1 text-xs font-mono bg-[#0a2472]/5 dark:bg-white/5 text-navy dark:text-amber">
              /{news.slug}
            </span>
          </div>

          {/* Summary */}
          <p className="text-base italic font-semibold text-navy/70 dark:text-gray-300 mb-2">
            {news.summary}
          </p>

          {/* Content */}
          <p className="text-sm leading-relaxed text-navy/60 dark:text-gray-400 line-clamp-3 mb-6 flex-grow">
            {news.content?.replace(/<[^>]*>?/gm, '') || ''}
          </p>

          {/* Category + author */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#0a2472]/10 dark:border-white/10">
            <span
              className="rounded-full px-3 py-1 text-xs font-bold tracking-wide"
              style={{ backgroundColor: colorTheme.bg, color: colorTheme.text }}
            >
              {categoryName}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#0a2472]/10 dark:bg-white/10">
                <User className="w-3.5 h-3.5 text-navy dark:text-gray-300" />
              </div>
              <span className="text-sm font-semibold text-navy dark:text-gray-300">
                {news.author?.first_name || 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
