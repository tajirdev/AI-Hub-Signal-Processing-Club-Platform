import { Link } from 'react-router-dom';
import { BookOpen, Users, FileText, Download, Calendar, Star, CheckCircle } from 'lucide-react';
import { getImageUrl } from '../../services/api';
import { cn } from '../../utils/cn';

const BRAND = {
  navy: "#0a2472",
  navyDark: "#061539",
  amber: "#ffba08",
};

export function ResearchCard({ research, className }) {
  const pubDate = research.publication_date ? new Date(research.publication_date) : null;
  const dateStr = pubDate ? pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing';
  const authorCount = Array.isArray(research.authors) ? research.authors.length : 0;

  return (
    <div className={cn(
      "relative w-[320px] shrink-0 snap-start rounded-[24px] overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1 flex flex-col h-full bg-white dark:bg-[#061539] border border-gray-100 dark:border-white/10",
      className
    )}>
      {/* Decorative Top Accent */}
      <div className="h-2 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${BRAND.navy}, ${BRAND.amber})` }} />

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0a2472]/10 dark:bg-white/10 text-[#0a2472] dark:text-[#ffba08]">
              <BookOpen className="w-4 h-4" />
            </div>
            {research.featured && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#ffba08] bg-[#ffba08]/10 px-2 py-1 rounded-md border border-[#ffba08]/20">
                <Star className="w-3 h-3 fill-current" /> Featured
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {dateStr}
          </span>
        </div>

        <h3 className="font-bold text-lg text-[#0a2472] dark:text-white mb-2 line-clamp-2 leading-snug">
          {research.title}
        </h3>

        <div className="flex gap-2 mb-3">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1",
            research.is_published 
              ? "text-green-600 dark:text-green-400 bg-green-500/10" 
              : "text-[#ffba08] bg-[#ffba08]/10"
          )}>
            <CheckCircle className="w-3 h-3" />
            {research.is_published ? "Published" : "Pre-print"}
          </span>
        </div>
        
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-3 mb-2">
          <span className="font-semibold text-gray-800 dark:text-gray-200">Abstract: </span>
          {research.abstract}
        </p>

        {research.content && (
           <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
             {research.content.replace(/<[^>]+>/g, '')} 
           </p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#ffba08]" />
              <span>{authorCount > 0 ? `${authorCount} Author${authorCount > 1 ? 's' : ''}` : 'AI Hub Team'}</span>
            </div>
            
            <Link 
              to={`/research/${research.slug || research.id}`} 
              className="text-[#0a2472] dark:text-white hover:text-[#ffba08] dark:hover:text-[#ffba08] transition-colors"
            >
              Read More &rarr;
            </Link>
          </div>

          {research.file?.path && (
            <a
              href={getImageUrl(research.file.path)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-sm mt-2"
              style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.navyDark})` }}
            >
              <FileText className="w-4 h-4 text-[#ffba08]" />
              View PDF Document
              <Download className="w-3.5 h-3.5 ml-auto mr-1 opacity-70" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
