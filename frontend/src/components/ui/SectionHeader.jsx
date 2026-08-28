import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SectionHeader({ label, title, subtitle, ctaText, ctaLink, className }) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6", className)}>
      <div className="max-w-2xl">
        {label && (
          <span className="inline-block text-amber uppercase tracking-widest text-xs font-bold mb-3 border-b-2 border-amber pb-1">
            {label}
          </span>
        )}
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-navy dark:text-white mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {subtitle}
          </p>
        )}
      </div>
      
      {ctaText && ctaLink && (
        <Link 
          to={ctaLink} 
          className="group inline-flex items-center text-navy dark:text-amber font-heading font-bold uppercase tracking-wider text-sm hover:text-amber-hover transition-colors"
        >
          {ctaText}
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
