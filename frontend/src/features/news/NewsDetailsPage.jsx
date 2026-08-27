import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchNewsById } from '../../services/endpoints';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { MemberCard } from '../../components/cards/MemberCard';
import { getImageUrl } from '../../services/api';
import { ArrowLeft, Calendar, FileText, User } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ScrollReveal } from '../../components/ui/ScrollReveal';

export function NewsDetailsPage() {
  const { id } = useParams();
  const [newsItem, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNewsById(id);
        setNews(data);
      } catch (err) {
        console.error("Failed to load post details:", err);
        setError("News article not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><LoadingState message="Loading news..." /></main>;
  if (error) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><ErrorState message={error} /></main>;
  if (!newsItem) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><EmptyState title="News Not Found" message="The requested news article could not be found." /></main>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071225] pt-20 md:pt-24 flex flex-col">
      <div className="max-w-[800px] mx-auto w-full px-6 pt-8 pb-4">
        <Link to="/news" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#0a2472] dark:hover:text-amber transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Link>
      </div>

      <article className="max-w-[800px] mx-auto w-full px-6 pb-20">
        <ScrollReveal animation="fade-up" delay={0}>
          <header className="mb-10">
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <Badge variant="primary" className="bg-[#0a2472]/10 dark:bg-white/10 text-[#0a2472] dark:text-gray-200 border-none">
                <FileText className="w-3 h-3 mr-1" /> News
              </Badge>
              {newsItem.categories && newsItem.categories.map((cat, i) => (
                <Badge key={i} variant="outline" className="text-gray-500 dark:text-gray-400">
                  {cat.name}
                </Badge>
              ))}
              <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 ml-2">
                <Calendar className="w-4 h-4 mr-1.5" />
                {newsItem.published_at ? new Date(newsItem.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-navy dark:text-white leading-tight mb-6">
              {newsItem.title}
            </h1>
          </header>
        </ScrollReveal>

        {newsItem.cover_image && (
          <ScrollReveal animation="fade-up" delay={50}>
            <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-xl border border-gray-100 dark:border-white/10">
              <img 
                src={getImageUrl(newsItem.cover_image)} 
                alt={newsItem.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal animation="fade-up" delay={100}>
          <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none mb-16 leading-relaxed">
            {newsItem.summary && (
              <p className="text-xl md:text-2xl font-medium text-navy dark:text-white mb-8 italic">
                {newsItem.summary}
              </p>
            )}
            <div className="whitespace-pre-wrap">
              {newsItem.content}
            </div>
          </div>
        </ScrollReveal>

        {newsItem.author && (
          <ScrollReveal animation="fade-up" delay={150}>
            <div className="border-t border-gray-200 dark:border-white/10 pt-12 mt-12">
              <h2 className="text-2xl font-heading font-black text-navy dark:text-white mb-8">About the Author</h2>
              <MemberCard member={{ show_profile: true, user: newsItem.author, position: 'Author' }} />
            </div>
          </ScrollReveal>
        )}
      </article>
    </main>
  );
}
