import { ensureExternalUrl } from '../../utils/url';
import  { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEventById } from '../../services/endpoints';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { getImageUrl } from '../../services/api';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Tag, User } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ScrollReveal } from '../../components/ui/ScrollReveal';

export function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        console.error("Failed to load event details:", err);
        setError("Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><LoadingState message="Loading event details..." /></main>;
  if (error) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><ErrorState message={error} /></main>;
  if (!event) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><EmptyState title="Event Not Found" message="The requested event could not be found." /></main>;

  const startDate = event.event_date ? new Date(event.event_date) : null;
  const isPast = startDate ? (startDate.getTime() + 86400000) < new Date().getTime() : false;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071225] pt-20 md:pt-24 flex flex-col">
      <div className="max-w-[1000px] mx-auto w-full px-6 pt-8 pb-4">
        <Link to="/events" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#0a2472] dark:hover:text-amber transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
      </div>

      <article className="max-w-[1000px] mx-auto w-full px-6 pb-20">
        <ScrollReveal animation="fade-up" delay={0}>
          <header className="mb-10">
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <Badge variant={isPast ? "outline" : "primary"} className={isPast ? "text-gray-500" : "bg-amber text-navy border-none"}>
                {isPast ? "Past Event" : "Upcoming"}
              </Badge>
              {event.category && (
                <Badge variant="outline" className="text-gray-500 dark:text-gray-400">
                  <Tag className="w-3 h-3 mr-1" />
                  {event.category.name}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-black text-navy dark:text-white leading-tight mb-6 break-words">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 font-medium text-lg mt-8">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#0a2472] dark:text-amber" />
                {startDate ? startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'TBA'}
              </div>
              {event.location && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-[#0a2472] dark:text-amber" />
                  {event.location}
                </div>
              )}
            </div>

            {event.user && (
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-navy/10 dark:border-white/10">
                {event.user.avatar_url ? (
                  <img src={getImageUrl(event.user.avatar_url)} alt={event.user.first_name} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-[#0a1628] shadow-sm" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-navy/10 dark:bg-white/10 flex items-center justify-center text-navy dark:text-white font-bold shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">Organized by</span>
                  <span className="text-sm font-semibold text-navy dark:text-white">{event.user.first_name} {event.user.last_name}</span>
                </div>
              </div>
            )}

            {event.registration_link && (
              <div className="mt-8">
                <a href={ensureExternalUrl(event.registration_link)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-4 bg-navy dark:bg-white text-white dark:text-navy font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Register Now
                </a>
              </div>
            )}
          </header>
        </ScrollReveal>

        {event.cover?.path && (
          <ScrollReveal animation="fade-up" delay={50}>
            <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-16 shadow-xl border border-gray-100 dark:border-white/10">
              <img 
                src={getImageUrl(event.cover.path)} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal animation="fade-up" delay={100}>
          <div className="bg-white dark:bg-[#0a1628] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-white/10 relative overflow-hidden">
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-6 relative z-10">Event Details</h2>
            <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none whitespace-pre-wrap relative z-10 leading-relaxed">
              {event.description}
            </div>
          </div>
        </ScrollReveal>
      </article>
    </main>
  );
}
