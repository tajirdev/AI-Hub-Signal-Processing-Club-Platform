import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchResearchById } from '../../services/endpoints';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { MemberCard } from '../../components/cards/MemberCard';
import { getImageUrl } from '../../services/api';
import { ArrowLeft, ExternalLink, Download, Calendar, BookOpen, FileText } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ScrollReveal } from '../../components/ui/ScrollReveal';

export function ResearchDetailsPage() {
  const { id } = useParams();
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchResearchById(id);
        setResearch(data);
      } catch (err) {
        console.error("Failed to load research details:", err);
        setError("Research paper not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><LoadingState message="Loading research details..." /></main>;
  if (error) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><ErrorState message={error} /></main>;
  if (!research) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><EmptyState title="Research Not Found" message="The requested paper could not be found." /></main>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071225] pt-20 md:pt-24 flex flex-col">
      <div className="max-w-[1000px] mx-auto w-full px-6 pt-8 pb-4">
        <Link to="/research" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#0a2472] dark:hover:text-amber transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Research
        </Link>
      </div>

      <article className="max-w-[1000px] mx-auto w-full px-6 pb-20">
        <ScrollReveal animation="fade-up" delay={0}>
          <header className="mb-10">
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <Badge variant="primary" className="bg-[#0a2472]/10 dark:bg-white/10 text-[#0a2472] dark:text-gray-200 border-none">
                <BookOpen className="w-3 h-3 mr-1" /> Publication
              </Badge>
              <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 ml-2">
                <Calendar className="w-4 h-4 mr-1.5" />
                {research.publication_date ? new Date(research.publication_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Ongoing'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-navy dark:text-white leading-tight mb-6">
              {research.title}
            </h1>

            <div className="flex flex-wrap gap-4 mt-8">
              {research.link && (
                <a href={research.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-navy dark:bg-white text-white dark:text-navy font-bold rounded-full hover:opacity-90 transition-opacity">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  External Link
                </a>
              )}
              {research.file?.path && (
                <a href={getImageUrl(research.file?.path)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-amber text-navy font-bold rounded-full hover:bg-amber-hover transition-colors shadow-lg shadow-amber/20">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </a>
              )}
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150}>
          <div className="bg-white dark:bg-[#0a1628] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-white/10 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <FileText className="w-48 h-48 text-navy dark:text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-6 relative z-10">Abstract</h2>
            <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none whitespace-pre-wrap mb-10 relative z-10 leading-relaxed italic">
              {research.abstract}
            </div>

            {research.content && (
              <div className="relative z-10 mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-navy dark:text-white mb-4">Details</h3>
                <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none whitespace-pre-wrap">
                  {research.content}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {research.authors && research.authors.length > 0 && (
          <ScrollReveal animation="fade-up" delay={200}>
            <div>
              <h2 className="text-3xl font-heading font-black text-navy dark:text-white mb-8">Authors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {research.authors.map((authorEntry, idx) => (
                  <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
                    <MemberCard member={authorEntry.member || authorEntry} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </article>
    </main>
  );
}
