import { Link } from 'react-router-dom';
import { Calendar, MapPin, ExternalLink, ArrowRight, Tag } from 'lucide-react';
import { getImageUrl } from '../../services/api';
import { cn } from '../../utils/cn';

const BRAND = {
  navy: "#0a2472",
  navyDark: "#061539",
  amber: "#ffba08",
};

export function EventCard({ event, className }) {
  const startDate = event.event_date ? new Date(event.event_date) : null;
  const month = startDate ? startDate.toLocaleDateString('en-US', { month: 'short' }) : 'TBA';
  const day = startDate ? startDate.toLocaleDateString('en-US', { day: '2-digit' }) : '--';

  return (
    <div className={cn(
      "relative w-[85vw] sm:w-[320px] md:w-[350px] shrink-0 snap-start rounded-[24px] overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1 flex flex-col h-full bg-white dark:bg-[#061539] border border-gray-100 dark:border-white/10",
      className
    )}>
      {/* Cover Image */}
      <div className="relative h-40 w-full overflow-hidden shrink-0 bg-gray-100 dark:bg-[#061539]">
        {event.cover?.path ? (
          <img 
            src={getImageUrl(event.cover.path)} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center opacity-90" style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.navyDark})` }}>
             <Calendar className="w-10 h-10 mb-2 opacity-50" style={{ color: BRAND.amber }} />
             <span className="text-xs font-medium opacity-50 uppercase tracking-widest text-white">Event</span>
          </div>
        )}
        
        {/* Date Badge over Image */}
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-[#0a2472]/95 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[60px] text-center shadow-lg border border-white/20">
          <span className="block text-[#ffba08] font-bold uppercase text-[10px] tracking-wider leading-none mb-1">{month}</span>
          <span className="block text-[#0a2472] dark:text-white font-black text-xl leading-none">{day}</span>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-5">
        {/* Category Badge */}
        {event.category?.name && (
          <div className="mb-3">
             <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#0a2472]/5 dark:bg-white/10 text-[#0a2472] dark:text-[#ffba08] border border-[#0a2472]/15 dark:border-[#ffba08]/40">
               <Tag className="w-3 h-3" />
               {event.category.name}
             </span>
          </div>
        )}

        <h3 className="font-bold text-lg text-[#0a2472] dark:text-white mb-2 line-clamp-2 leading-tight">
          {event.title}
        </h3>
        
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 flex-grow">
          {event.description}
        </p>
        
        <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-5">
          <MapPin className="w-3.5 h-3.5 mr-1.5" style={{ color: BRAND.amber }} />
          <span className="truncate">{event.location || 'Location TBA'}</span>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-white/10 mt-auto">
          <Link 
            to={`/events/${event.id}`} 
            className="inline-flex items-center text-sm font-bold text-[#0a2472] dark:text-white hover:text-[#ffba08] dark:hover:text-[#ffba08] transition-colors"
          >
            Details
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
          
          {event.registration_link && (
             <a
               href={event.registration_link}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-md"
               style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.amber})` }}
             >
               Register
               <ExternalLink className="w-3 h-3" />
             </a>
          )}
        </div>
      </div>
    </div>
  );
}
