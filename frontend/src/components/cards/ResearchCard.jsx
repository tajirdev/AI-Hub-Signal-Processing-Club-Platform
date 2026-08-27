import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, ArrowRight, BookOpen } from 'lucide-react';

import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export function ResearchCard({ research, className }) {
  return (
    <div className={cn("w-[85vw] sm:w-[320px] md:w-[350px] shrink-0 snap-start bg-white dark:bg-[#0a1628] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative", className)}>
      <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="primary" className="bg-[#0a2472]/10 dark:bg-white/10 text-[#0a2472] dark:text-gray-200 border-none">
            <BookOpen className="w-3 h-3 mr-1" />
            Publication
          </Badge>
          {research.featured && (
            <Badge variant="primary" className="bg-[#ffba08]/20 text-[#cc9506] border-none">
              Featured
            </Badge>
          )}
        </div>

        <h3 className="text-xl font-heading font-black text-navy dark:text-white mb-3 group-hover:text-amber transition-colors line-clamp-2">
          {research.title}
        </h3>

        <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {research.abstract}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
          <span className="inline-flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {research.created_at ? new Date(research.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Recent'}
          </span>
          <Link
            to={`/research/${research.id}`}
            className="inline-flex items-center text-sm font-semibold transition-colors duration-200 group-hover:underline"
            style={{ color: '#ffba08' }}
          >
            Read Paper &rarr;
          </Link>
        </div>
      </div>
      
      {/* Decorative background icon */}
      <div className="absolute -bottom-6 -right-6 text-gray-50 dark:text-white/5 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
        <FileText className="w-32 h-32" />
      </div>
    </div>
  );
}
