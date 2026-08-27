import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchResourceById } from '../../services/endpoints';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { getImageUrl } from '../../services/api';
import { ArrowLeft, ExternalLink, Download, Calendar, Database, File, Video, Code, Box } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ScrollReveal } from '../../components/ui/ScrollReveal';

export function ResourceDetailsPage() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchResourceById(id);
        setResource(data);
      } catch (err) {
        console.error("Failed to load resource details:", err);
        setError("Resource not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><LoadingState message="Loading resource details..." /></main>;
  if (error) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><ErrorState message={error} /></main>;
  if (!resource) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><EmptyState title="Resource Not Found" message="The requested resource could not be found." /></main>;

  const getTypeIcon = (type, className = "w-4 h-4") => {
    const t = type?.toLowerCase() || '';
    if (t.includes('dataset')) return <Database className={className} />;
    if (t.includes('video') || t.includes('lecture')) return <Video className={className} />;
    if (t.includes('code') || t.includes('github')) return <Code className={className} />;
    if (t.includes('model') || t.includes('weights')) return <Box className={className} />;
    return <File className={className} />;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071225] pt-20 md:pt-24 flex flex-col">
      <div className="max-w-[1000px] mx-auto w-full px-6 pt-8 pb-4">
        <Link to="/resources" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#0a2472] dark:hover:text-amber transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Resources
        </Link>
      </div>

      <article className="max-w-[1000px] mx-auto w-full px-6 pb-20">
        <ScrollReveal animation="fade-up" delay={0}>
          <header className="mb-10">
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <Badge variant="primary" className="bg-[#0a2472]/10 dark:bg-white/10 text-[#0a2472] dark:text-gray-200 border-none capitalize">
                {getTypeIcon(resource.type, "w-3 h-3 mr-1")} {resource.type || 'Resource'}
              </Badge>
              <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 ml-2">
                <Calendar className="w-4 h-4 mr-1.5" />
                {resource.created_at ? new Date(resource.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown Date'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-navy dark:text-white leading-tight mb-6">
              {resource.title}
            </h1>

            <div className="flex flex-wrap gap-4 mt-8">
              {resource.link && (
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-navy dark:bg-white text-white dark:text-navy font-bold rounded-full hover:opacity-90 transition-opacity">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Access External Link
                </a>
              )}
              {resource.file?.path && (
                <a href={getImageUrl(resource.file?.path)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-amber text-navy font-bold rounded-full hover:bg-amber-hover transition-colors shadow-lg shadow-amber/20">
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </a>
              )}
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150}>
          <div className="bg-white dark:bg-[#0a1628] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-white/10 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              {getTypeIcon(resource.type, "w-48 h-48 text-navy dark:text-white")}
            </div>
            
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-6 relative z-10">Resource Overview</h2>
            <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none whitespace-pre-wrap mb-10 relative z-10 leading-relaxed">
              {resource.description || 'No detailed description available for this resource.'}
            </div>
          </div>
        </ScrollReveal>

      </article>
    </main>
  );
}
