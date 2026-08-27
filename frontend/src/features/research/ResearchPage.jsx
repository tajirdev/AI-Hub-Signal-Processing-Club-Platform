import React, { useState, useEffect, useCallback } from 'react';
import { fetchResearch } from '../../services/endpoints';
import { ResearchCard } from '../../components/cards/ResearchCard';
import { LoadingState, EmptyState, ErrorState } from '../../components/ui/States';
import { Search, BookOpen } from 'lucide-react';
import { Pagination } from '../../components/ui/Pagination';
import { ScrollReveal } from '../../components/ui/ScrollReveal';

export function ResearchPage() {
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadResearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchResearch({ 
        page, 
        limit: 9, 
        title: debouncedSearch || undefined 
      });
      // Handle the case where the API might return an array directly or a paginated object
      const items = Array.isArray(data) ? data : (data.results || data.items || []);
      setResearchList(items);
      setTotalPages(data.total_pages || 1);
      setTotalItems(data.total || items.length);
    } catch (err) {
      console.error("Failed to load research:", err);
      setError("Failed to load research papers. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    document.title = 'AI & Signal Processing Hub | Research';
    loadResearch();
  }, [loadResearch]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071225] flex flex-col">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden text-center border-b border-gray-100 dark:border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <ScrollReveal animation="fade-up" delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10 text-sm font-semibold tracking-wide text-navy dark:text-gray-300 mb-8">
              <BookOpen className="w-4 h-4 text-amber dark:text-amber" />
              <span>ACADEMIC PUBLICATIONS</span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-navy dark:text-white leading-tight tracking-tight mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-blue-600 dark:from-amber dark:to-orange-500">Research</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
              Explore the latest papers, studies, and academic contributions published by our technical subgroups.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16 px-6 relative z-10">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
            <ScrollReveal animation="fade-right" delay={100} className="w-full md:w-[400px]">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search research papers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a1628] text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"
                />
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-left" delay={100}>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Showing {researchList.length} of {totalItems} paper{totalItems !== 1 ? 's' : ''}
              </div>
            </ScrollReveal>
          </div>

          {loading ? (
            <LoadingState message="Loading research papers..." />
          ) : error ? (
            <ErrorState message={error} onRetry={loadResearch} />
          ) : researchList.length === 0 ? (
            <EmptyState 
              title="No research found" 
              message={debouncedSearch ? "No papers match your current search." : "No research papers have been published yet."} 
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {researchList.map((research, index) => (
                  <ScrollReveal key={research.id} animation="fade-up" delay={(index % 9) * 100}>
                    <ResearchCard research={research} />
                  </ScrollReveal>
                ))}
              </div>
              
              <div className="flex justify-center">
                <ScrollReveal animation="fade-up" delay={200}>
                  <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                  />
                </ScrollReveal>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
