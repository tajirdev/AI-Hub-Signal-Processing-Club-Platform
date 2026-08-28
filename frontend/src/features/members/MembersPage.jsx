import React, { useState, useEffect, useCallback } from 'react';
import { fetchMembers } from '../../services/endpoints';
import { MemberCard } from '../../components/cards/MemberCard';
import { LoadingState, EmptyState, ErrorState } from '../../components/ui/States';
import { Search, Users } from 'lucide-react';
import { Pagination } from '../../components/ui/Pagination';
import { ScrollReveal } from '../../components/ui/ScrollReveal';

export function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const limit = 12;
      const skip = (page - 1) * limit;
      
      const data = await fetchMembers({ 
        skip, 
        limit, 
        search: debouncedSearch || undefined 
      });
      
      // Handle the case where the API might return an array directly or a paginated object
      const items = Array.isArray(data) ? data : (data.results || data.items || []);
      
      setMembers(items);
      
      const total = data.total || items.length;
      setTotalItems(total);
      setTotalPages(data.total_pages || Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error("Failed to load members:", err);
      setError("Failed to load members. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071225] flex flex-col">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden text-center border-b border-gray-100 dark:border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <ScrollReveal animation="fade-up" delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10 text-sm font-semibold tracking-wide text-navy dark:text-gray-300 mb-8">
              <Users className="w-4 h-4 text-amber dark:text-amber" />
              <span>THE COMMUNITY</span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-navy dark:text-white leading-tight tracking-tight mb-6 break-words hyphens-auto">
              Our <span className="text-amber">Members</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
              Meet the brilliant minds and innovators driving the SigniAI forward.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ScrollReveal animation="fade-right" delay={100} className="w-full md:w-[400px]">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name, role, or subgroup..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a1628] text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"
                  />
                </div>
              </ScrollReveal>
            </div>
            
            <ScrollReveal animation="fade-up" delay={300} className="mt-8">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Showing {members.length} of {totalItems} member{totalItems !== 1 ? 's' : ''}
              </div>
            </ScrollReveal>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section className="flex-grow py-16 md:py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingState message="Loading members..." />
          ) : error ? (
            <ErrorState message={error} onRetry={loadMembers} />
          ) : members.length === 0 ? (
            <EmptyState 
              icon={Users}
              title="No members found"
              message="Try adjusting your search criteria."
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {members.map((member, idx) => (
                  <ScrollReveal key={member.id} animation="fade-up" delay={(idx % 8) * 50}>
                    <MemberCard member={member} />
                  </ScrollReveal>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-16 w-full flex justify-center">
                  <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
